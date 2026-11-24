import { DurableObject } from 'cloudflare:workers';

export class VisitorCounter extends DurableObject {
  constructor(context, env) {
    super(context, env);
    this.db = context.storage.sql;
    context.storage.transactionSync(() => {
      this.db.exec('CREATE TABLE IF NOT EXISTS pageviews (id INTEGER PRIMARY KEY, total INTEGER NOT NULL)');
      this.db.exec('INSERT OR IGNORE INTO pageviews VALUES (1, 0)');
      this.db.exec('CREATE TABLE IF NOT EXISTS country_pageviews (country TEXT PRIMARY KEY, count INTEGER NOT NULL)');
      const legacyTable = this.db.exec("SELECT 1 FROM sqlite_master WHERE name = 'visits' AND type = 'table'").toArray();
      if (legacyTable.length) {
        this.db.exec('UPDATE pageviews SET total = total + (SELECT COALESCE(SUM(count), 0) FROM visits) WHERE id = 1');
        this.db.exec("INSERT INTO country_pageviews SELECT country, count FROM visits WHERE country != 'XX'");
        this.db.exec('DROP TABLE visits');
      }
    });
  }

  snapshot(increment, country) {
    if (increment) {
      this.ctx.storage.transactionSync(() => {
        this.db.exec('UPDATE pageviews SET total = total + 1 WHERE id = 1');
        if (country) {
          this.db.exec(
            'INSERT INTO country_pageviews VALUES (?, 1) ON CONFLICT (country) DO UPDATE SET count = count + 1',
            country,
          );
        }
      });
    }
    const { total } = this.db.exec('SELECT total FROM pageviews WHERE id = 1').one();
    const countries = {};
    for (const { country, count } of this.db.exec('SELECT country, count FROM country_pageviews')) {
      countries[country] = count;
    }
    return { total, countries };
  }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/pageviews') return new Response(null, { status: 404 });
    const { method } = request;
    if (method !== 'GET' && method !== 'POST') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
    }

    const origin = request.headers.get('Origin');
    if ((origin && origin !== env.SITE_ORIGIN) || (method === 'POST' && !origin)) {
      return new Response(null, { status: 403 });
    }

    const counter = env.VISITS.getByName('homepage');
    const code = request.cf?.country;
    const country = /^[A-Z]{2}$/.test(code) && code !== 'XX' ? code : null;
    return Response.json(await counter.snapshot(method === 'POST', country), {
      headers: {
        'Access-Control-Allow-Origin': env.SITE_ORIGIN,
        'Cache-Control': 'no-store',
      },
    });
  },
};

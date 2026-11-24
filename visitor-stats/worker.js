import { DurableObject } from 'cloudflare:workers';

export class VisitorCounter extends DurableObject {
  constructor(context, env) {
    super(context, env);
    this.db = context.storage.sql;
    context.storage.transactionSync(() => {
      this.db.exec('CREATE TABLE IF NOT EXISTS pageviews (id INTEGER PRIMARY KEY, total INTEGER NOT NULL)');
      this.db.exec('INSERT OR IGNORE INTO pageviews VALUES (1, 0)');
      const legacyTable = this.db.exec("SELECT 1 FROM sqlite_master WHERE name = 'visits' AND type = 'table'").toArray();
      if (legacyTable.length) {
        this.db.exec('UPDATE pageviews SET total = total + (SELECT COALESCE(SUM(count), 0) FROM visits) WHERE id = 1');
        this.db.exec('DROP TABLE visits');
      }
    });
  }

  snapshot(increment) {
    const query = increment
      ? 'UPDATE pageviews SET total = total + 1 WHERE id = 1 RETURNING total'
      : 'SELECT total FROM pageviews WHERE id = 1';
    return this.db.exec(query).one();
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
    return Response.json(await counter.snapshot(method === 'POST'), {
      headers: {
        'Access-Control-Allow-Origin': env.SITE_ORIGIN,
        'Cache-Control': 'no-store',
      },
    });
  },
};

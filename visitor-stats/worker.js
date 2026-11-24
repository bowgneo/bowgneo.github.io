import { DurableObject } from 'cloudflare:workers';

export class VisitorCounter extends DurableObject {
  constructor(context, env) {
    super(context, env);
    this.db = context.storage.sql;
    this.db.exec('CREATE TABLE IF NOT EXISTS visits (country TEXT PRIMARY KEY, count INTEGER NOT NULL)');
  }

  snapshot(countryToRecord) {
    if (countryToRecord) {
      this.db.exec(
        'INSERT INTO visits (country, count) VALUES (?, 1) ON CONFLICT (country) DO UPDATE SET count = count + 1',
        countryToRecord,
      );
    }
    const countries = {};
    let total = 0;
    for (const { country, count } of this.db.exec('SELECT country, count FROM visits')) {
      total += count;
      if (country !== 'XX') countries[country] = count;
    }
    return { total, countries };
  }
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/visits') return new Response(null, { status: 404 });
    const { method } = request;
    if (method !== 'GET' && method !== 'POST') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
    }

    const origin = request.headers.get('Origin');
    if ((origin && origin !== env.SITE_ORIGIN) || (method === 'POST' && !origin)) {
      return new Response(null, { status: 403 });
    }

    // Cloudflare classifies the source IP. Only the resulting country count is stored.
    const code = request.cf?.country;
    const country = /^[A-Z]{2}$/.test(code) ? code : 'XX';
    const counter = env.VISITS.getByName('homepage');
    return Response.json(await counter.snapshot(method === 'POST' ? country : null), {
      headers: {
        'Access-Control-Allow-Origin': env.SITE_ORIGIN,
        'Cache-Control': 'no-store',
      },
    });
  },
};

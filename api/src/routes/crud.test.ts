import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const resources = [
  { load: () => import('./product'), path: 'products', id: 'productId', seed: 'products' },
  { load: () => import('./supplier'), path: 'suppliers', id: 'supplierId', seed: 'suppliers' },
  { load: () => import('./order'), path: 'orders', id: 'orderId', seed: 'orders' },
  { load: () => import('./orderDetail'), path: 'order-details', id: 'orderDetailId', seed: 'orderDetails' },
  { load: () => import('./orderDetailDelivery'), path: 'order-detail-deliveries', id: 'deliveryId', seed: 'orderDetailDeliveries' },
  { load: () => import('./headquarters'), path: 'headquarters', id: 'headquartersId', seed: 'headquarters' },
  { load: () => import('./delivery'), path: 'deliveries', id: 'deliveryId', seed: 'deliveries' },
] as const;

describe.each(resources)('$path API', ({ load, path, id, seed }) => {
  let app: express.Express;
  let initial: Record<string, unknown>[];
  const base = `/api/${path}`;

  beforeEach(async () => {
    vi.resetModules();
    const { default: router } = await load();
    const seedData = await import('../seedData');
    initial = seedData[seed] as unknown as Record<string, unknown>[];
    app = express();
    app.use(express.json());
    app.use(base, router);
  });

  it('lists seeded records and retrieves one by ID', async () => {
    const list = await request(app).get(base);
    expect(list.status).toBe(200);
    expect(list.body).toEqual(initial);

    const record = await request(app).get(`${base}/${initial[0][id]}`);
    expect(record.status).toBe(200);
    expect(record.body).toEqual(initial[0]);
  });

  it('creates, updates, and deletes a record', async () => {
    const created = { ...initial[0], [id]: 98765 };
    const post = await request(app).post(base).send(created);
    expect(post.status).toBe(201);
    expect(post.body).toEqual(created);

    const changed = { ...created, description: 'Updated in test' };
    const put = await request(app).put(`${base}/98765`).send(changed);
    expect(put.status).toBe(200);
    expect(put.body).toEqual(changed);
    expect((await request(app).get(`${base}/98765`)).body).toEqual(changed);

    const deleted = await request(app).delete(`${base}/98765`);
    expect(deleted.status).toBe(204);
    expect((await request(app).get(`${base}/98765`)).status).toBe(404);
  });

  it('returns 404 for missing and malformed IDs on read and writes', async () => {
    for (const missingId of ['98765', 'not-a-number']) {
      expect((await request(app).get(`${base}/${missingId}`)).status).toBe(404);
      expect((await request(app).put(`${base}/${missingId}`).send(initial[0])).status).toBe(404);
      expect((await request(app).delete(`${base}/${missingId}`)).status).toBe(404);
    }
  });
});
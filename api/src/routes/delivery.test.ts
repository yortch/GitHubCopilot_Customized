import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { exec } from 'child_process';

vi.mock('child_process', () => ({ exec: vi.fn() }));

describe('delivery status', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.resetModules();
    vi.mocked(exec).mockReset();
    const { default: router } = await import('./delivery');
    app = express();
    app.use(express.json());
    app.use('/api/deliveries', router);
  });

  it('updates status without invoking a command', async () => {
    const response = await request(app).put('/api/deliveries/1/status').send({ status: 'Delivered' });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Delivered');
    expect(exec).not.toHaveBeenCalled();
  });

  it('returns 404 when the delivery is missing', async () => {
    const response = await request(app).put('/api/deliveries/99999/status').send({ status: 'Delivered' });
    expect(response.status).toBe(404);
  });

  it('returns notification output after the mocked callback succeeds', async () => {
    vi.mocked(exec).mockImplementationOnce(((command: string, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
      callback(null, 'sent', '');
      return {} as ReturnType<typeof exec>;
    }) as typeof exec);
    const response = await request(app).put('/api/deliveries/1/status').send({ status: 'Sent', notifyCommand: 'never-run' });
    expect(response.status).toBe(200);
    expect(response.body.commandOutput).toBe('sent');
    expect(exec).toHaveBeenCalledWith('never-run', expect.any(Function));
  });

  it('returns 500 after the mocked callback fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(exec).mockImplementationOnce(((command: string, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
      callback(new Error('notification failed'), '', '');
      return {} as ReturnType<typeof exec>;
    }) as typeof exec);
    const response = await request(app).put('/api/deliveries/1/status').send({ status: 'Sent', notifyCommand: 'never-run' });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('notification failed');
    consoleError.mockRestore();
  });
});
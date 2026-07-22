import { describe, it, expect } from 'vite-plus/test';
import { uploadToR2, getFromR2, deleteFromR2 } from './r2';
import type { PlatformEnv } from '../email/sender';
import type { D1Database, R2Bucket, R2ObjectBody } from '@cloudflare/workers-types';

describe('R2 Storage Service', () => {
	it('uses mock fallback when STORAGE binding is not configured', async () => {
		const uploadRes = await uploadToR2(undefined, 'tenant1/doc.pdf', 'content');
		expect(uploadRes.success).toBe(true);
		expect(uploadRes.key).toBe('tenant1/doc.pdf');

		const getRes = await getFromR2(undefined, 'tenant1/doc.pdf');
		expect(getRes.success).toBe(true);
		expect(getRes.data).toBeNull();

		const delRes = await deleteFromR2(undefined, 'tenant1/doc.pdf');
		expect(delRes.success).toBe(true);
	});

	it('interacts with Cloudflare STORAGE R2 bucket binding', async () => {
		const store = new Map<string, unknown>();

		const mockEnv: PlatformEnv = {
			DB: {} as D1Database,
			STORAGE: {
				put: async (key: string, value: unknown) => {
					store.set(key, value);
				},
				get: async (key: string) => {
					return (store.get(key) ?? null) as R2ObjectBody | null;
				},
				delete: async (key: string) => {
					store.delete(key);
				}
			} as unknown as R2Bucket
		};

		const uploadRes = await uploadToR2(mockEnv, 'contracts/101.pdf', 'dummy-data');
		expect(uploadRes.success).toBe(true);
		expect(store.get('contracts/101.pdf')).toBe('dummy-data');

		const getRes = await getFromR2(mockEnv, 'contracts/101.pdf');
		expect(getRes.success).toBe(true);
		expect(getRes.data).toBe('dummy-data');

		const delRes = await deleteFromR2(mockEnv, 'contracts/101.pdf');
		expect(delRes.success).toBe(true);
		expect(store.has('contracts/101.pdf')).toBe(false);
	});
});

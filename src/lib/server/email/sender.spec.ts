import { describe, it, expect } from 'vite-plus/test';
import { sendEmail, type PlatformEnv } from './sender';
import type { D1Database, SendEmail } from '@cloudflare/workers-types';

describe('sendEmail Service', () => {
	it('uses mock fallback when platform environment is undefined', async () => {
		const result = await sendEmail(undefined, {
			to: 'client@test.com',
			subject: 'Welcome to LegalForge',
			text: 'Hello world'
		});

		expect(result.success).toBe(true);
	});

	it('invokes SEND_EMAIL binding when provided', async () => {
		let sentPayload: unknown = null;

		const mockEnv: PlatformEnv = {
			DB: {} as D1Database,
			SEND_EMAIL: {
				send: async (payload: unknown) => {
					sentPayload = payload;
				}
			} as unknown as SendEmail
		};

		const result = await sendEmail(mockEnv, {
			to: 'admin@firm.com',
			subject: 'Contract Notification',
			text: 'Contract created successfully',
			html: '<p>Contract created successfully</p>'
		});

		expect(result.success).toBe(true);
		expect(sentPayload).toEqual({
			to: 'admin@firm.com',
			from: 'noreply@legalforge.co.za',
			subject: 'Contract Notification',
			content: '<p>Contract created successfully</p>'
		});
	});

	it('handles errors gracefully when SEND_EMAIL fails', async () => {
		const mockEnv: PlatformEnv = {
			DB: {} as D1Database,
			SEND_EMAIL: {
				send: async () => {
					throw new Error('Cloudflare Email dispatch failed');
				}
			} as unknown as SendEmail
		};

		const result = await sendEmail(mockEnv, {
			to: 'fail@test.com',
			subject: 'Test',
			text: 'Fail'
		});

		expect(result.success).toBe(false);
		expect(result.error).toBe('Cloudflare Email dispatch failed');
	});
});

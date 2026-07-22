import type { D1Database, R2Bucket, SendEmail } from '@cloudflare/workers-types';

export interface SendEmailOptions {
	to: string;
	subject: string;
	text: string;
	html?: string;
	from?: string;
}

export interface PlatformEnv {
	DB?: D1Database;
	STORAGE?: R2Bucket;
	SEND_EMAIL?: SendEmail;
}

/**
 * Sends a transactional email using Cloudflare Email Routing / Mail bindings.
 * Falls back to console logging when running in local dev / non-Worker environments.
 */
export async function sendEmail(
	platformEnv: PlatformEnv | undefined,
	options: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
	const defaultFrom = 'noreply@legalforge.co.za';
	const from = options.from || defaultFrom;

	// Cloudflare Email Routing (SendEmail binding)
	if (platformEnv?.SEND_EMAIL) {
		try {
			const emailMessage = {
				to: options.to,
				from,
				subject: options.subject,
				content: options.html || options.text
			};
			await platformEnv.SEND_EMAIL.send(
				emailMessage as unknown as Parameters<SendEmail['send']>[0]
			);
			return { success: true };
		} catch (err) {
			const errorMsg = err instanceof Error ? err.message : String(err);
			console.error('[Email Sender] Failed to send email via Cloudflare Email Routing:', errorMsg);
			return { success: false, error: errorMsg };
		}
	}

	// Fallback for local development or mock environments
	console.log(`[Email Sender Mock] Sending email to ${options.to}:`, {
		from,
		subject: options.subject,
		body: options.text
	});

	return { success: true };
}

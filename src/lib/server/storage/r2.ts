import type { R2ObjectBody } from '@cloudflare/workers-types';
import type { PlatformEnv } from '../email/sender';

/**
 * Uploads a file buffer to Cloudflare R2 bucket.
 */
export async function uploadToR2(
	platformEnv: PlatformEnv | undefined,
	key: string,
	content: ArrayBuffer | ArrayBufferView | ReadableStream | string,
	contentType = 'application/pdf'
): Promise<{ success: boolean; key?: string; error?: string }> {
	if (!platformEnv?.STORAGE) {
		console.log(`[R2 Storage Mock] Uploading file to key "${key}" (${contentType})`);
		return { success: true, key };
	}

	try {
		await platformEnv.STORAGE.put(
			key,
			content as Parameters<NonNullable<PlatformEnv['STORAGE']>['put']>[1],
			{
				httpMetadata: { contentType }
			}
		);
		return { success: true, key };
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		console.error(`[R2 Storage] Failed to upload key "${key}":`, errorMsg);
		return { success: false, error: errorMsg };
	}
}

/**
 * Downloads a file object from Cloudflare R2 bucket.
 */
export async function getFromR2(
	platformEnv: PlatformEnv | undefined,
	key: string
): Promise<{ success: boolean; data?: R2ObjectBody | null; error?: string }> {
	if (!platformEnv?.STORAGE) {
		console.log(`[R2 Storage Mock] Retrieving file from key "${key}"`);
		return { success: true, data: null };
	}

	try {
		const data = await platformEnv.STORAGE.get(key);
		return { success: true, data };
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		console.error(`[R2 Storage] Failed to retrieve key "${key}":`, errorMsg);
		return { success: false, error: errorMsg };
	}
}

/**
 * Deletes a file from Cloudflare R2 bucket.
 */
export async function deleteFromR2(
	platformEnv: PlatformEnv | undefined,
	key: string
): Promise<{ success: boolean; error?: string }> {
	if (!platformEnv?.STORAGE) {
		console.log(`[R2 Storage Mock] Deleting key "${key}"`);
		return { success: true };
	}

	try {
		await platformEnv.STORAGE.delete(key);
		return { success: true };
	} catch (err) {
		const errorMsg = err instanceof Error ? err.message : String(err);
		console.error(`[R2 Storage] Failed to delete key "${key}":`, errorMsg);
		return { success: false, error: errorMsg };
	}
}

import { getUser } from '$lib/remote/auth.remote';
import { file } from './db/schema';
import { error } from '@sveltejs/kit';
import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import { db } from './db';
import { getRequestEvent } from '$app/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: '1GB',
			maxFileCount: 10
		}
	})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// This code runs on your server before upload
			const user = await getUser();

			// If you throw, the user will not be able to upload
			if (!user) return error(401);

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id };
		})
		.onUploadComplete(async ({ file: uploadedFile }) => {
			const event = getRequestEvent();

			if (!event.params.project_id) return error(404);
			// This code RUNS ON YOUR SERVER after upload
			await db.insert(file).values({
				projectId: event.params.project_id,
				type: uploadedFile.type,
				utURL: uploadedFile.ufsUrl
			});
		})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

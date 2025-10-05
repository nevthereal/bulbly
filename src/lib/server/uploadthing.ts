import { getUser } from '$lib/remote/auth.remote';
import { file } from './db/schema';
import { error } from '@sveltejs/kit';
import { createUploadthing } from 'uploadthing/server';
import type { FileRouter } from 'uploadthing/server';
import { db } from './db';
import { getRequestEvent } from '$app/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const myRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	uploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: '512MB',
			maxFileCount: 20
		},
		pdf: {
			maxFileSize: '1GB',
			maxFileCount: 5
		}
	})
		// Set permissions and file types for this FileRoute
		.middleware(async () => {
			// This code runs on your server before upload
			const user = await getUser();
			const event = getRequestEvent();

			const { project_id } = event.params;

			// If you throw, the user will not be able to upload
			if (!user) return error(401);
			if (!project_id) return error(404);

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id, prjId: project_id };
		})
		.onUploadComplete(async ({ file: uploadedFile, metadata }) => {
			await db.insert(file).values({
				projectId: metadata.prjId,
				type: uploadedFile.type,
				utURL: uploadedFile.ufsUrl,
				name: uploadedFile.name,
				ownerId: metadata.userId
			});
		})
} satisfies FileRouter;

export type MyRouter = typeof myRouter;

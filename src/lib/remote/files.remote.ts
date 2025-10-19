import { command, getRequestEvent, query } from '$app/server';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { requireAuth } from './auth.remote';
import { db } from '$lib/server/db';
import { file } from '$lib/server/db/schema';
import z from 'zod';
import { utapi } from '$lib/server/uploadthing';
import { DrizzleError } from 'drizzle-orm/errors';
import { UploadThingError } from 'uploadthing/server';

export const getFiles = query(async () => {
	await requireAuth();

	const projectId = getRequestEvent().params.project_id;

	if (!projectId) error(401);

	return await db.select().from(file).where(eq(file.projectId, projectId));
});

export const deleteFile = command(z.uuid(), async (fileId) => {
	await requireAuth();

	try {
		const deletedFile = await db.delete(file).where(eq(file.id, fileId)).returning();

		await utapi.deleteFiles(deletedFile.map((f) => f.utKey));
		await getFiles().refresh();
	} catch (err) {
		if (err instanceof DrizzleError) return error(500, err.message);
		if (err instanceof UploadThingError) return error(500, err.message);

		return error(500, JSON.stringify(err));
	}
});

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

import { eq, and } from 'drizzle-orm';

export const getFiles = query(async () => {
	const user = await requireAuth();
	const { params } = getRequestEvent();
	if (!params.project_id) throw error(404);

	return await db
		.select({
			id: file.id,
			name: file.name,
			type: file.type,
			utURL: file.utURL
		})
		.from(file)
		.where(and(eq(file.projectId, params.project_id), eq(file.ownerId, user.id)));
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

import { command, getRequestEvent, query } from '$app/server';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { requireAuth } from './auth.remote';
import { db } from '$lib/server/db';
import { file } from '$lib/server/db/schema';
import z from 'zod';
import { utapi } from '$lib/server/uploadthing';
import { DrizzleError } from 'drizzle-orm/errors';
import { UploadThingError } from 'uploadthing/server';

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
	const user = await requireAuth();

	try {
		// 1) Lookup with authz
		const rows = await db
			.select()
			.from(file)
			.where(and(eq(file.id, fileId), eq(file.ownerId, user.id)))
			.limit(1);
		if (!rows.length) throw error(404, 'File not found');
		const f = rows[0];

		// 2) Delete from storage first
		await utapi.deleteFiles([f.utKey]);

		// 3) Delete DB row
		await db.delete(file).where(eq(file.id, fileId));

		// 4) Refresh cache
		await getFiles().refresh();
	} catch (err) {
		if (err instanceof DrizzleError) throw error(500, err.message);
		if (err instanceof UploadThingError) throw error(500, err.message);
		throw error(500, JSON.stringify(err));
	}
});

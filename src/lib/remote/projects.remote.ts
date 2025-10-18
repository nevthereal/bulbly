import { command, form, getRequestEvent, query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { requireAuth } from './auth.remote';
import { file, project, subject } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { utapi } from '$lib/server/uploadthing';

export const getSubjectsWithProjects = query(async () => {
	const user = await requireAuth();

	const projects = await db.query.subject.findMany({
		where: {
			userId: user.id
		},
		with: {
			projects: true
		}
	});

	return projects;
});

export const getSubjects = query(async () => {
	const user = await requireAuth();

	const subjects = await db.query.subject.findMany({
		where: {
			userId: user.id,
			active: true
		}
	});

	return subjects;
});

export const getProject = query(async () => {
	const user = await requireAuth();

	const id = getRequestEvent().params.project_id;

	if (!id) error(401);

	const project = await db.query.project.findFirst({
		where: {
			id,
			creatorId: user.id
		},
		with: {
			files: true
		}
	});

	if (!project) error(404, 'Project not found');

	return project;
});

export const getFiles = query(async () => {
	await requireAuth();

	const projectId = getRequestEvent().params.project_id;

	if (!projectId) error(401);

	return await db.select().from(file).where(eq(file.projectId, projectId));
});

export const createProject = form(
	z.object({ title: z.string(), subjectId: z.uuid() }),
	async ({ title, subjectId }) => {
		const user = await requireAuth();

		const [{ id }] = await db
			.insert(project)
			.values({
				name: title,
				subjectId,
				creatorId: user.id
			})
			.returning();
		return redirect(302, `/project/${id}`);
	}
);

export const createSubject = form(z.object({ title: z.string() }), async ({ title }) => {
	const user = await requireAuth();

	await db.insert(subject).values({
		title,
		userId: user.id
	});
});

export const deleteFile = command(z.uuid(), async (fileId) => {
	await requireAuth();

	try {
		const deletedFile = await db.delete(file).where(eq(file.id, fileId)).returning();

		await utapi.deleteFiles(deletedFile.map((f) => f.utKey));
		await getFiles().refresh();
	} catch (e) {
		return error(400, String(e));
	}
});

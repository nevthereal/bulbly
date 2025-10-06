import { command, form, query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getUser } from './auth.remote';
import { file, project, subject } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getSubjectsWithProjects = query(async () => {
	const user = await getUser();

	if (!user) return error(401);

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
	const user = await getUser();

	if (!user) return error(401);

	const subjects = await db.query.subject.findMany({
		where: {
			userId: user.id,
			active: true
		}
	});

	return subjects;
});

export const getProject = query(z.uuid(), async (id) => {
	const user = await getUser();

	if (!user) return error(401);

	const project = await db.query.project.findFirst({
		where: {
			id,
			creatorId: user.id
		},
		with: {
			files: true
		}
	});

	if (!project) return error(404);

	return project;
});

export const getFiles = query(z.uuid(), async (projectId) => {
	const user = await getUser();
	if (!user) return error(401);

	const files = await db.query.file.findMany({
		where: {
			projectId
		}
	});
	return files;
});

export const createProject = form(
	z.object({ title: z.string(), subjectId: z.uuid() }),
	async ({ title, subjectId }) => {
		const user = await getUser();
		if (!user) return error(401);

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
	const user = await getUser();
	if (!user) return;

	await db.insert(subject).values({
		title,
		userId: user.id
	});
});

export const deleteFile = command(z.uuid(), async (fileId) => {
	const user = await getUser();
	if (!user) return;

	const deletedFile = await db.delete(file).where(eq(file.id, fileId)).returning();

	await getFiles(deletedFile[0].projectId).refresh();
});

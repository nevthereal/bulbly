import { command, form, getRequestEvent, query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { requireAuth } from './auth.remote';
import { project, subject } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

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

export const createProject = form(
	z.object({ name: z.string(), subjectId: z.uuid() }),
	async ({ name, subjectId }) => {
		const user = await requireAuth();

		const [{ id }] = await db
			.insert(project)
			.values({
				name,
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

export const deleteSubject = command(z.string(), async (id) => {
	const user = await requireAuth();
	await db.transaction(async (tx) => {
		const qSubject = await tx.query.subject.findFirst({
			where: {
				id,
				userId: user.id
			}
		});

		if (!qSubject) return error(401, 'Not your subject');

		await tx.delete(subject).where(eq(subject.id, qSubject.id));
	});
});

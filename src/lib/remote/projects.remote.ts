import { form, query } from '$app/server';
import { z } from 'zod';
import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getUser } from './auth.remote';
import { project } from '$lib/server/db/schema';

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
			userId: user.id
		}
	});

	return subjects;
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
				userId: user.id
			})
			.returning();
		return redirect(302, `/project/${id}`);
	}
);

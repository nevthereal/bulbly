import { query } from '$app/server';
import { db } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getUser } from './auth.remote';

export const getAllProjects = query(async () => {
	const user = await getUser();

	if (!user) return error(401);

	const projects = await db.query.project.findMany({
		where: {
			userId: user.id
		}
	});

	if (projects.length === 0) return redirect(302, 'project/create');

	return projects;
});

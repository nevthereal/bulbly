import { command, getRequestEvent, query } from '$app/server';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { studyPlanStep } from '$lib/server/db/schema/tools.sql';
import { requireAuth } from './auth.remote';

export const getStudySteps = query(async () => {
	const { params } = getRequestEvent();

	if (!params.project_id) error(404);

	const steps = await db.query.studyPlanStep.findMany({
		where: {
			projectId: params.project_id
		},
		orderBy: {
			date: 'asc'
		}
	});

	if (!steps.length) return null;

	return steps;
});

export const deleteSteps = command(async () => {
	await requireAuth();
	const { params } = getRequestEvent();

	if (!params.project_id) error(404);

	await db.delete(studyPlanStep).where(eq(studyPlanStep.projectId, params.project_id));

	getStudySteps().refresh();
});

import { command, form, getRequestEvent, query } from '$app/server';
import { eq, inArray, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { file } from '$lib/server/db/schema';
import { gateway } from '$lib/server/utils';
import { AISDKError, streamObject } from 'ai';
import z from 'zod';
import { error } from '@sveltejs/kit';
import { studyPlanStep, typeEnum } from '$lib/server/db/schema/tools.sql';
import { requireAuth } from './auth.remote';

export const createStudyPlan = form(
	z.object({
		date: z.iso.date().refine((v) => new Date(v)),
		files: z.array(z.string()).nonempty()
	}),
	async (data) => {
		await requireAuth();
		const { project_id } = getRequestEvent().params;

		if (!project_id) return error(401);

		// ensure `and` is imported from 'drizzle-orm'
		const user = await requireAuth();

		const filesFromDb = await db
			.select()
			.from(file)
			.where(
				and(inArray(file.id, data.files), eq(file.projectId, project_id), eq(file.ownerId, user.id))
			);

		if (filesFromDb.length !== data.files.length) {
			return error(403, 'One or more files are not accessible for this project.');
		}

		try {
			const { elementStream } = streamObject({
				model: gateway('anthropic/claude-haiku-4.5'),
				schema: z.object({
					title: z
						.string()
						.describe(
							'Short description/Name of the step of the studyplan. Please do not include stuff like "lesson:" or "assignment" or "revision" in here. The title should be short and about the thing to study about.'
						),
					date: z.iso
						.datetime()
						.describe('When the step should be commenced in ISO 8601 datetime format'),
					description: z.string().describe('More detailed information about the step'),
					type: z.enum(typeEnum.enumValues)
				}),
				system: `You are a tool that generates a study plan given files for context and the date of the exam. Right now is ${new Date()}`,
				output: 'array',
				messages: [
					{
						role: 'user',
						content: filesFromDb.map((f) => ({
							data: f.utURL,
							type: 'file',
							filename: f.name,
							mediaType: f.type
						}))
					},
					{
						role: 'user',
						content: `My exam is set on ${data.date}`
					}
				],
				maxRetries: 5
			});

			await db.transaction(async (tx) => {
				for await (const step of elementStream) {
					await tx.insert(studyPlanStep).values({
						title: step.title,
						date: new Date(step.date),
						projectId: project_id,
						type: step.type,
						description: step.description
					});
				}
			});
			getStudySteps().refresh();
		} catch (err) {
			if (err instanceof AISDKError) {
				console.error(err);
				throw error(
					500,
					'An error occurred while generating the study plan. Please try again later.'
				);
			}
			throw error(500, 'Unexpected error while generating the study plan.');
		}
	}
);

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

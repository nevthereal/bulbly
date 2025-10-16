import { form, getRequestEvent, query } from '$app/server';
import { inArray } from 'drizzle-orm';
import { db } from './server/db';
import { file } from './server/db/schema';
import { gateway } from './server/utils';
import { streamObject } from 'ai';
import z from 'zod';
import { error } from '@sveltejs/kit';
import { studyPlanStep } from './server/db/schema/tools.sql';

export const createStudyPlan = form(
	z.object({
		date: z.iso.date().refine((v) => new Date(v)),
		files: z.array(z.string()).min(1)
	}),
	async (data) => {
		const { project_id } = getRequestEvent().params;

		if (!project_id) return error(401);

		const filesFromDb = await db.query.file.findMany({
			where: {
				RAW: inArray(file.id, data.files)
			}
		});

		const { elementStream } = streamObject({
			model: gateway('anthropic/claude-haiku-4.5'),
			schema: z.object({
				stepName: z.string().describe('Description/Name of the step of the studyplan'),
				date: z.iso
					.datetime()
					.describe('When the step should be commenced in ISO 8601 datetime format')
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
					content: step.stepName,
					date: new Date(step.date),
					projectId: project_id
				});
			}
		});
		getStudySteps().refresh();
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

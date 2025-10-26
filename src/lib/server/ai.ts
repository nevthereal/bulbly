import { tool, type InferUITools, type ToolSet, type UIMessage } from 'ai';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from './db';
import { studyPlanStep, studyStepTypes } from './db/schema';
import z from 'zod';

const zStudyStep = z.object({
	title: z
		.string()
		.describe(
			'Short description/Name of the step of the studyplan. Please do not include stuff like "lesson:" or "assignment" or "revision" in here. The title should be short and about the thing to study about.'
		),
	date: z.iso.datetime().describe('When the step should be commenced in ISO 8601 datetime format'),
	description: z.string().describe('More detailed information about the step'),
	type: z.enum(studyStepTypes)
});

const studyPlanTool = tool({
	description:
		'Creates a study plan for the user at a given date using the context of given files.',
	inputSchema: zStudyStep,
	name: 'study_plan',

	execute: async (args) => {
		const { params } = getRequestEvent();

		if (!params.project_id) error(404, 'No project ID');
		return await db
			.insert(studyPlanStep)
			.values({
				title: args.title,
				date: new Date(args.date),
				projectId: params.project_id,
				type: args.type,
				description: args.description
			})
			.returning();
	}
});

export const tools = { study_plan: studyPlanTool } satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<never, never, ChatTools>;

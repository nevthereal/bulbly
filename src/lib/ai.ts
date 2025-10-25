import { tool, type InferUITools, type ToolSet, type UIMessage } from 'ai';
import { zStudyStep } from './zod';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from './server/db';
import { studyPlanStep } from './server/db/schema';

const studyPlanTool = tool({
	description:
		'Creates a study plan for the user at a given date using the context of given files.',
	inputSchema: zStudyStep,
	name: 'study_plan',

	execute: async (args) => {
		const { params } = getRequestEvent();

		if (!params.project_id) error(404, 'No project ID');
		await db.insert(studyPlanStep).values({
			title: args.title,
			date: new Date(args.date),
			projectId: params.project_id,
			type: args.type,
			description: args.description
		});
	}
});

export const tools = { study_plan: studyPlanTool } satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<ChatTools>;

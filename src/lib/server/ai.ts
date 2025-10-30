import { tool, type InferUITools, type ToolSet, type UIMessage } from 'ai';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';
import { db } from './db';
import { studyPlanStep, studyStepTypes } from './db/schema';
import z from 'zod';
import Exa from 'exa-js';
import { EXA_API_KEY } from '$env/static/private';

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

export const exa = new Exa(EXA_API_KEY);

const webSearchTool = tool({
	name: 'web_search',
	description: 'Search the web for up-to-date information',
	inputSchema: z.object({
		query: z.string().min(1).max(100).describe('The search query')
	}),
	execute: async ({ query }) => {
		const { results } = await exa.searchAndContents(query, {
			livecrawl: 'always',
			numResults: 3
		});
		return results.map((result) => ({
			title: result.title,
			url: result.url,
			content: result.text.slice(0, 1000), // take just the first 1000 characters
			publishedDate: result.publishedDate
		}));
	}
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

const flashCardTool = tool({
	description: 'Create flashcards from given files',
	inputSchema: z.object({
		term: z.string(),
		definition: z.string()
	}),
	name: 'study_plan',

	execute: async (args) => {
		const { params } = getRequestEvent();

		if (!params.project_id) error(404, 'No project ID');
		console.log(args);
	}
});

export const tools = {
	study_plan: studyPlanTool,
	web_search: webSearchTool,
	flashcards: flashCardTool
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<never, never, ChatTools>;

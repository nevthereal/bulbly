import { zStudyStep } from '$lib/zod';
import { tool } from 'ai';
import { db } from './db';
import { studyPlanStep } from './db/schema';

export const studyPlanTool = tool({
	description:
		'Creates a study plan for the user at a given date using the context of given files. Can ONLY be called if the date is actually given.',
	inputSchema: zStudyStep,
	name: 'study_plan',
	execute: async (args) => {
		console.log(args);
	}
});

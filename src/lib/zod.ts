import z from 'zod';

export const studyStepTypes = [
	'milestone',
	'lesson',
	'assignment',
	'project',
	'exam',
	'review',
	'break'
] as const;

export const zStudyStep = z.object({
	title: z
		.string()
		.describe(
			'Short description/Name of the step of the studyplan. Please do not include stuff like "lesson:" or "assignment" or "revision" in here. The title should be short and about the thing to study about.'
		),
	date: z.iso.datetime().describe('When the step should be commenced in ISO 8601 datetime format'),
	description: z.string().describe('More detailed information about the step'),
	type: z.enum(studyStepTypes)
});

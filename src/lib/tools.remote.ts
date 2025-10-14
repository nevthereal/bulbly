import { form } from '$app/server';
import { inArray } from 'drizzle-orm';
import { db } from './server/db';
import { file } from './server/db/schema';
import { gateway } from './server/utils';
import { streamObject } from 'ai';
import z from 'zod';

export const createStudyPlan = form(
	z.object({
		date: z.iso.date(),
		files: z.array(z.string())
	}),
	async ({ date, files }) => {
		const filesFromDb = await db.select().from(file).where(inArray(file.id, files));

		const { elementStream } = streamObject({
			model: gateway('openai/gpt-5-mini'),
			schema: z.object({
				step: z.string(),
				date: z.date()
			}),
			system:
				'You are a tool that generates a study plan given files for context and the date of the exam.',
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
					content: `My exam is set on ${date}`
				}
			]
		});

		for await (const step of elementStream) {
			console.log(step);
		}
	}
);

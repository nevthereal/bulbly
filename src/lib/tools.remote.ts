import { form } from '$app/server';
import z from 'zod';

export const createStudyPlan = form(
	z.object({
		date: z.iso.date(),
		fileUrls: z.array(z.string())
	}),
	async () => {}
);

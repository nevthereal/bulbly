import z from 'zod';

export const chatConfigSchema = z.object({
	studyMode: z.boolean()
});

export type ChatConfig = z.input<typeof chatConfigSchema>;

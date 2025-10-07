import { VERCEL_AI_KEY } from '$env/static/private';
import { createGateway } from '@ai-sdk/gateway';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';

const gateway = createGateway({
	apiKey: VERCEL_AI_KEY
});

const system =
	`You are a chatbot assistant in a study app.` +
	`You should be answering the questions from the provided files, if given, else answer from your knowledge or search the web.` +
	`Please answer in the language you were prompted or the language of given files.`;

export async function POST({ request }) {
	const { messages }: { messages: UIMessage[] } = await request.json();

	const result = streamText({
		model: gateway('openai/gpt-5-mini'),
		messages: convertToModelMessages(messages),
		system
	});

	return result.toUIMessageStreamResponse();
}

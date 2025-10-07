import { OPENAI_KEY, VERCEL_AI_KEY } from '$env/static/private';
import { createOpenAI } from '@ai-sdk/openai';
import { createGateway } from '@ai-sdk/gateway';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';

const gateway = createGateway({
	apiKey: VERCEL_AI_KEY
});
//
const openai = createOpenAI({
	apiKey: OPENAI_KEY
});

export async function POST({ request }) {
	const { messages }: { messages: UIMessage[] } = await request.json();

	console.log(messages);

	const result = streamText({
		model: gateway('openai/gpt-5-mini'),
		messages: convertToModelMessages(messages)
	});

	return result.toUIMessageStreamResponse();
}

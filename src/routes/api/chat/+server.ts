import { VERCEL_AI_KEY } from '$env/static/private';
import { createGateway } from '@ai-sdk/gateway';
import { streamText, type UIMessage, convertToModelMessages } from 'ai';

const gateway = createGateway({
	apiKey: VERCEL_AI_KEY
});

export async function POST({ request }) {
	const { messages }: { messages: UIMessage[] } = await request.json();

	const result = streamText({
		model: gateway('openai/gpt-5-mini'),
		messages: convertToModelMessages(messages)
	});

	return result.toUIMessageStreamResponse();
}

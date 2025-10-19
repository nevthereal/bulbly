import { VERCEL_AI_KEY } from '$env/static/private';
import { createGateway } from 'ai';

export const gateway = createGateway({
	apiKey: VERCEL_AI_KEY
});

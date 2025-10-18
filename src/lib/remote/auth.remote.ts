import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const getUser = query(() => {
	const { locals } = getRequestEvent();

	return locals.user;
});

export const requireAuth = query(() => {
	const { locals } = getRequestEvent();

	if (!locals.user) return redirect(307, '/login');

	return locals.user;
});

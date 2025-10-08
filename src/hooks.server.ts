import superjson from 'superjson';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import z from 'zod';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	const smCookie = event.cookies.get('studymode');
	event.locals.studyMode = superjson.parse<boolean>(smCookie ?? 'false');

	if (session) {
		event.locals.user = session.user;
		event.locals.session = session.session;
	}

	return svelteKitHandler({ event, resolve, auth, building });
}

import { command, getRequestEvent, query } from '$app/server';

export const getStudyMode = query(async () => {
	const { locals } = getRequestEvent();

	return locals.studyMode;
});

export const toggleStudyMode = command(async () => {
	const current = await getStudyMode();
	const { cookies } = getRequestEvent();

	cookies.set('studymode', String(!current), { path: '/' });
});

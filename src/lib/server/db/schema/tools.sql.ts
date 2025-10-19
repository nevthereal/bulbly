import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { project } from './projects.sql';

export const typeEnum = pgEnum('study_plan_types', [
	'milestone',
	'lesson',
	'assignment',
	'project',
	'exam',
	'review',
	'break'
]);

export const studyPlanStep = pgTable('study_plan_step', {
	id: uuid().primaryKey().defaultRandom(),
	date: timestamp().notNull(),
	projectId: uuid()
		.references(() => project.id, { onDelete: 'cascade' })
		.notNull(),
	title: text().notNull(),
	description: text().notNull(),
	type: typeEnum().notNull()
});

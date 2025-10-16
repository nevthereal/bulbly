import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { project } from './projects.sql';

export const studyPlanStep = pgTable('study_plan_step', {
	id: uuid().primaryKey().defaultRandom(),
	date: timestamp().notNull(),
	projectId: uuid()
		.references(() => project.id, { onDelete: 'cascade' })
		.notNull(),
	content: text().notNull()
});

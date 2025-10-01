import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';

export const project = pgTable('project', {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	subjectId: uuid()
		.references(() => subject.id)
		.notNull(),
	userId: text().references(() => user.id)
});

export const subject = pgTable('subject', {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	userId: text().references(() => user.id)
});

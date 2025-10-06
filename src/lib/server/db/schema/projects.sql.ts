import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth.sql';

export const project = pgTable('project', {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	subjectId: uuid()
		.references(() => subject.id)
		.notNull(),
	creatorId: text()
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull()
});

export const subject = pgTable('subject', {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	userId: text()
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	active: boolean().default(true).notNull()
});

export const file = pgTable('file', {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	ownerId: text()
		.references(() => user.id, { onDelete: 'cascade' })
		.notNull(),
	utURL: text().notNull(),
	type: text().notNull(),
	projectId: uuid()
		.notNull()
		.references(() => project.id, { onDelete: 'cascade' })
});

export type File = typeof file.$inferSelect;

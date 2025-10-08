import type { File } from './server/db/schema';

class Attachments {
	private attachments: File[] = $state([]);

	add(file: File) {
		this.attachments.push(file);
	}

	get files() {
		return this.attachments;
	}

	remove(id: string) {
		this.attachments = this.attachments.filter((a) => a.id != id);
	}

	clear() {
		this.attachments = [];
	}
}

export const attachments = new Attachments();

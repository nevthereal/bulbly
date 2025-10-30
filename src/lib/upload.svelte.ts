import { SvelteSet } from 'svelte/reactivity';

export class UploadManager {
	files = $state<File[]>([]);
	progress = $state<number | null>(null);
	isUploading = $state(false);

	get fileList(): FileList | undefined {
		if (this.files.length === 0) return undefined;
		const dt = new DataTransfer();
		this.files.forEach((file) => dt.items.add(file));
		return dt.files;
	}

	get hasFiles(): boolean {
		return this.files.length > 0;
	}

	get isEmpty(): boolean {
		return this.files.length === 0;
	}

	setFiles(fileList: FileList | undefined) {
		if (!fileList || fileList.length === 0) {
			return;
		}
		const newFiles = Array.from(fileList);
		// Only add files that don't already exist (based on name)
		const existingNames = new SvelteSet(this.files.map((f) => f.name));
		newFiles.forEach((file) => {
			if (!existingNames.has(file.name)) {
				this.files.push(file);
			}
		});
	}

	addFile(file: File) {
		this.files.push(file);
	}

	removeFile(fileName: string) {
		this.files = this.files.filter((file) => file.name !== fileName);
	}

	clear() {
		this.files = [];
		this.progress = null;
	}

	setProgress(progress: number) {
		this.progress = progress;
	}

	setUploading(uploading: boolean) {
		this.isUploading = uploading;
	}
}

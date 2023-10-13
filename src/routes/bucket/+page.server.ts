import { appwrite, setCookie } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { buckets } = setCookie(event.cookies.getAll());
	buckets.grassBucket.createFile('base64 string', []);
};

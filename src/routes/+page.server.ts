import { queries, setCookie } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { collections } = setCookie(event.cookies.getAll());
	const query = queries.grassQuery.equal('grassName', 'nameOfGrass');
	const res = await collections.collectionGrass.getDocument([query]);
	console.log(res);

	return {
		res
	};
};

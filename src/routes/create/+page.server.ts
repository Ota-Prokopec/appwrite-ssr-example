import { queries, setCookie } from '$lib/appwrite';
import { permissions } from 'appwrite-ssr';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { collections, account } = setCookie(event.cookies.getAll());
	const user = await account.get();
	collections.collectionGrass.createDocument(
		{ grassName: 'fdas', grassEnumValue: 'value' },
		permissions.owner(user.$id)
	);
};

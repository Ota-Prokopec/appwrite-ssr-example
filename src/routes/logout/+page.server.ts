import { appwrite } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { account } = appwrite.none();
	const { sessionLegacyToken, sessionToken } = await account.logOut();
	event.cookies.delete(sessionToken.name);
};

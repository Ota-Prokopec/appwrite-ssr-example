import { appwrite } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { account } = appwrite.none();
	const { sessionLegacyToken, sessionToken } = await account.loginViaEmail(
		'otaprokopec@gmail.com',
		'aaaaaaaa'
	);
	event.cookies.set(sessionToken.name, sessionToken.value);
};

const loadO: PageServerLoad = async (event) => {
	const { account } = appwrite.none();
	const { sessionLegacyToken, sessionToken } = await account.oauth2Login(event.url);
	event.cookies.set(sessionToken.name, sessionToken.value);
};

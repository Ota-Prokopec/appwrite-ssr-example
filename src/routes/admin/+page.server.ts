import { queries, setAdmin, setCookie } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { account } = setCookie(event.cookies.getAll());
	const user = await account.get();
	const { users } = setAdmin();
	const res = await users.get(user.$id);
	console.log(res);

	return {
		res
	};
};

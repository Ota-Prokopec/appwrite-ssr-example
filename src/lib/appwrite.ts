import type { Types } from 'appwrite-ssr';
import appwriteSSR, { Query } from 'appwrite-ssr';

export type DocumentSkeleton = {
	$id: string;
	$collectionId: string;
	$databaseId: string;
	$createdAt: string;
	$updatedAt: string;
	$permissions: string[];
};

export type Document<T extends Partial<DocumentSkeleton> & object> = {
	[Key in keyof T]: T[Key] extends Record<string, unknown> ? Document<T[Key]> : T[Key];
} & DocumentSkeleton;

type GrassDocumentGet = Document<{
	grassName: string;
	grassOptionalDescription: string; //optional value with default value
	grassEnumValue: null | 'value' | 'value2';
}>;
type GrassDocumentCreate = {
	grassName: string;
	grassOptionalDescription?: string;
	grassEnumValue: null | 'value' | 'value2';
};

// key2 is optional but there is always a default value

export const appwrite = appwriteSSR.setProject({
	projectId: "localhost",
	hostname: 'localhost',
	endpoint: "localhost",
});

export const setCookie = (cookies: Types.Cookie[]) => {
	const app = appwrite.setCookie(cookies);
	const collectionGrass = new app.Collection<GrassDocumentGet, GrassDocumentCreate>(
		'test',
		'grass'
	);
	const grassBucket = new app.Bucket('grassBucket');

	return { collections: { collectionGrass }, ...app, buckets: { grassBucket } };
};

export const setAdmin = () => {
	const app = appwrite.setAdmin();
	const collectionGrass = new app.Collection<GrassDocumentGet, GrassDocumentCreate>(
		'test',
		'grass'
	);
	return { collections: { collectionGrass }, ...app };
};

export const grassQuery = Query<GrassDocumentGet>();

export const queries = {
	grassQuery
};

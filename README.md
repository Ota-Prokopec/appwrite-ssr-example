<h1 align="center" id="title">appwrite-ssr</h1>

<p id="description">appwrite-ssr will help you to create ssr applications with appwrite.</p>

<h2>🛠️ Installation Steps:</h2>

<p>download appwrite-ssr</p>

```
npm i appwrite-ssr
  or
yarn add appwrite-ssr
```

<p>you can find example code on github:
https://github.com/Ota-Prokopec/appwrite-ssr-example
</p>

<p>import appwrite-ssr</p>

```ts
import appwrite from 'appwrite-ssr'
```

<p>set up project id, project endpoint and hostname (you can also set apiKey if you want to use admin actions - it is optional)
</p>

```ts
import appwrite from 'appwrite-ssr'

appwrite.setProject({ endPoint: 'https://cloud.appwrite.io/v1', projectId: 'fjalůj', hostname: 'localhost', apiKey: 'key...' })
```

<p>how to begin? Set permissions by passing users session or use api key that you could act like admin</p>

```ts
// authorizate by passing users session
const { Collection } = appwrite.setSession('users session here')
//authorizate by passing users cookies
const { Collection } = appwriteSSR.setCookie([{ name: '', value: '' }])
//dont authorizate user - use this for signing user into app
const { Collection } = appwriteSSR.none()
//act as admin (use your apiKey)
const { Collection } = appwrite.setAdmin()
```

<p>log user into your application using email (example with SvelteKit)</p>

```ts
export const load: PageServerLoad = async (event) => {
	const { account } = appwrite.none()
	const { sessionLegacyToken, sessionToken } = await account.loginViaEmail('email', 'password')
	event.cookies.set(sessionToken.name, sessionToken.value)
}
```

<p>log user into your application using oAuth2 (example with SvelteKit)

</p>
<span>
on client side use this:
</span>

```ts
await user.createOAuth2Session(platform, `${location.origin}/auth/oauth2/success`, `${location.origin}/oauth2/failure`)
```

<span>
on server side use this:
</span>

```ts
//the path for this function has to be /auth/oauth2/success (strictly)
export const load: PageServerLoad = async (event) => {
	const { account } = appwrite.none()
	const { sessionLegacyToken, sessionToken } = await account.oauth2Login(event.url)
	event.cookies.set(sessionToken.name, sessionToken.value)
}
```

<p>log user out or your application (example with SvelteKit)</p>

```ts
//the path for this function has to be /auth/oauth2/success (strictly)
export const load: PageServerLoad = async (event) => {
	const { account } = appwrite.none()
	const { sessionLegacyToken, sessionToken } = await account.logOut()
	event.cookies.delete(sessionToken.name)
}
```

<p>create your own lib for all (here is my example with Sveltekit)

</p>

```ts
import type { Types } from 'appwrite-ssr'
import appwriteSSR, { Query } from 'appwrite-ssr'

export type DocumentSkeleton = {
	$id: string
	$collectionId: string
	$databaseId: string
	$createdAt: string
	$updatedAt: string
	$permissions: string[]
}

export type Document<T extends Partial<DocumentSkeleton> & object> = {
	[Key in keyof T]: T[Key] extends Record<string, unknown> ? Document<T[Key]> : T[Key]
} & DocumentSkeleton

type GrassDocumentGet = Document<{
	grassName: string
	grassOptionalDescription: string //optional value with default value
	grassEnumValue: null | 'value' | 'value2'
}>
type GrassDocumentCreate = {
	grassName: string
	grassOptionalDescription?: string
	grassEnumValue: null | 'value' | 'value2'
}

// key2 is optional but there is always a default value

export const appwrite = appwriteSSR.setProject({
	projectId: process.env.APPWRITE_PROJECT_ID,
	hostname: 'localhost',
	endpoint: process.env.APPWRITE_ENDPOINT,
	apiKey: process.env.APPWRITE_API_KEY,
})

export const setCookie = (cookies: Types.Cookie[]) => {
	const app = appwrite.setCookie(cookies)
	const collectionGrass = new app.Collection<GrassDocumentGet, GrassDocumentCreate>('test', 'grass')
	const grassBucket = new app.Bucket('grassBucket')

	return { collections: { collectionGrass }, ...app, buckets: { grassBucket } }
}

export const setAdmin = () => {
	const app = appwrite.setAdmin()
	const collectionGrass = new app.Collection<GrassDocumentGet, GrassDocumentCreate>('test', 'grass')
	return { collections: { collectionGrass }, ...app }
}

export const grassQuery = Query<GrassDocumentGet>()

export const queries = {
	grassQuery,
}
```

<p>initialize collections</p>

```ts
  import type {
	UserInfoDocument,
	UserInfoDocumentCreate,
  } from '@app/ts-types'

    import appwrite from '@app/appwrite-ssr'

	const { Collection } = appwrite.setSession(session)

	const userInfo =new Collection<UserInfoDocument, UserInfoDocumentCreate>('account', 'userInfo'),
	userInfo.createDocument({}, [userId])
```

<p>example code with Sveltekit (collections)</p>

```ts
import type { PageServerLoad } from './$types'
import type { Types } from 'appwrite-ssr'
import appwrite, { Query } from 'appwrite-ssr'

export type DocumentSkeleton = {
	$id: string
	$collectionId: string
	$databaseId: string
	$createdAt: string
	$updatedAt: string
	$permissions: string[]
}

export type Document<T extends Partial<DocumentSkeleton> & object> = {
	[Key in keyof T]: T[Key] extends Record<string, unknown> ? Document<T[Key]> : T[Key]
} & DocumentSkeleton

type GrassDocumentGet = Document<{
	grassName: string
	grassOptionalDescription: string //optional value with default value
	grassEnumValue: null | 'value' | 'value2'
}>
type GrassDocumentCreate = {
	grassName: string
	grassOptionalDescription?: string
	grassEnumValue: null | 'value' | 'value2'
}

// key2 is optional but there is always a default value

const setCookie = (cookies: Types.Cookie[]) => {
	const { Collection } = appwrite
		.setProject({
			endPoint: 'https://cloud.appwrite.io/v1',
			projectId: 'fa',
		})
		.setCookie(cookies)

	const collectionGrass = new Collection<GrassDocumentGet, GrassDocumentCreate>('experiences', 'userInfo')
	return { collectionGrass }
}

const grassQuery = Query<GrassDocumentGet>()

export const load: PageServerLoad = async (event) => {
	const cookies: Types.Cookie[] = event.cookies.getAll()
	const collections = setCookie(cookies)
	const result = await collections.collectionGrass.getDocument([grassQuery.equal('grassName', 'jj')])
	return { result }
}
```

<p>example code with Sveltekit (buckets)</p>

```ts
import appwrite, { permissions, type Types } from 'appwrite-ssr'
import type { PageServerLoad } from './$types'

const setCookie = (cookies: Types.Cookie[]) => {
	const { Bucket } = appwrite
		.setProject({
			endPoint: 'https://cloud.appwrite.io/v1',
			projectId: 'fads',
		})
		.setCookie(cookies)

	const bucketGrass = new Bucket('myBucketId')

	return { bucketGrass }
}

export const load: PageServerLoad = async (event) => {
	const buckets = setCookie(event.cookies.getAll())
	const base64 = ''
	const res = buckets.bucketGrass.createFile(base64, permissions.owner('myUserId'))
	return res
}
```

<h2>used packages/technologies:</h2>
appwrite

<h2>🛡️ License:</h2>

This project is licensed under the MIT

<h2>💖 Any questions?</h2>
otaprokopec@gmail.com

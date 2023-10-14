<h1 align="center" id="title">appwrite-ssr</h1>

<p id="description">appwrite-ssr will help you to create ssr applications with appwrite.</p>

<p>you can find example code on github:
https://github.com/Ota-Prokopec/appwrite-ssr-example
</p>
<p>Appwrite is an open-source backend as a service server that abstract and simplify complex and repetitive development tasks behind a very simple to use REST API. Appwrite aims to help you develop your apps faster and in a more secure way. Use the Web SDK to integrate your app with the Appwrite server to easily start interacting with all of Appwrite backend APIs and tools. For full API documentation and tutorials go to https://appwrite.io/docs
</p>

<h1>🛠️ Installation Steps:</h1>

```
npm i appwrite-ssr
  or
yarn add appwrite-ssr
```

<h1>import appwrite-ssr</h1>

```ts
import appwrite from 'appwrite-ssr'
```

<h1>set Appwrite project
</h1>
<p>set up appwrite project endpoint, project id and hostname of your server (you can also set apiKey if you want to use admin actions - it is optional)
</p>

```ts
import appwrite from 'appwrite-ssr'

appwrite.setProject({
	endPoint: 'https://cloud.appwrite.io/v1',
	projectId: 'your-project-id',
	hostname: 'your-server-hostname',
	apiKey: 'your-api-key',
})
```

<h1>how to begin?</h1>
<p>Connect user to your Appwrite by setting users session, or use setAdmin to act like admin</p>

```ts
// passing users session
const { Collection } = appwrite.setSession('users session here')
//authorizate by passing users cookies
const { Collection } = appwriteSSR.setCookie([{ name: '', value: '' }])
//dont authorizate user - use this for signing user into app
const { Collection } = appwriteSSR.none()
//act as admin (use your apiKey)
const { Collection } = appwrite.setAdmin()
```

<h1>Auth</h1>
<p>log user into your application using email</p>

```ts
const { account } = appwrite.none()
const { sessionLegacyToken, sessionToken } = await account.loginViaEmail('email', 'password')
event.cookies.set(sessionToken.name, sessionToken.value)
```

<p>log user into your application using oAuth2</p>
<p>
on client side use:
</p>

```ts
import { account } from 'appwrite' // https://www.npmjs.com/package/appwrite
await account.createOAuth2Session(platform, `${location.origin}/auth/oauth2/success`, `${location.origin}/oauth2/failure`)
```

<p>
on server side use:
</p>

```ts
//the path for this function has to be /auth/oauth2/success (strictly)
import appwrite from 'appwrite-ssr'

appwrite.setProject({
	endPoint: 'https://cloud.appwrite.io/v1',
	projectId: 'your-project-id',
	hostname: 'your-server-hostname',
	apiKey: 'your-api-key',
})
const { account } = appwrite.none()
const url = 'whole URL'
const { sessionLegacyToken, sessionToken } = await account.oauth2Login(url)
event.cookies.set(sessionToken.name, sessionToken.value)
```

<p>log user out or your application</p>

```ts
import appwrite from 'appwrite-ssr'

appwrite.setProject({
	endPoint: 'https://cloud.appwrite.io/v1',
	projectId: 'your-project-id',
	hostname: 'your-server-hostname',
	apiKey: 'your-api-key',
})
const { account } = appwrite.none()
const { sessionLegacyToken, sessionToken } = await account.logOut()
event.cookies.delete(sessionToken.name)
```

<h1>create your own instance</h1>

```ts
import type { Types } from 'appwrite-ssr'
import appwriteSSR, { Query } from 'appwrite-ssr'

export const appwrite = appwriteSSR.setProject({
	projectId: process.env.APPWRITE_PROJECT_ID,
	hostname: 'localhost',
	endpoint: process.env.APPWRITE_ENDPOINT,
	apiKey: process.env.APPWRITE_API_KEY,
})
```

<h1>example code (collections)</h1>

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

const { Collection } = appwrite.setCookie(cookies)

const collectionGrass = new Collection<GrassDocumentGet, GrassDocumentCreate>('your-database-id', 'your-collection-id')

const grassQuery = Query<GrassDocumentGet>()

const query = grassQuery.equal('grassName', 'nameOfGrass')
const res = await collectionGrass.getDocument([query])
```

<h1>example code (buckets)</h1>

```ts
import appwrite, { permissions, type Types } from 'appwrite-ssr'

const { Bucket } = appwrite
	.setProject({
		endPoint: 'https://cloud.appwrite.io/v1',
		projectId: 'fads',
	})
	.setCookie(cookies)

const bucketGrass = new Bucket('myBucketId')

return { bucketGrass }

const buckets = setCookie(event.cookies.getAll())
const base64 = ''
const res = bucketGrass.createFile(base64, permissions.owner('myUserId'))
```

<h2>used packages/technologies:</h2>
Appwrite

<h2>🛡️ License:</h2>

This project is licensed under the MIT

<h2>💖 Any questions?</h2>
otaprokopec@gmail.com

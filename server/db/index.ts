import { Db, MongoClient } from 'mongodb'

let client: MongoClient
let db: Db

export const mongo = async (): Promise<Db> => {
  if (!db) {
    client = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    db = client.db()

    // user

    await db.collection('users').createIndex(
      {
        email: 1
      },
      {
        unique: true
      }
    )

    await db.collection('users').createIndex({
      emailNotifications: 1
    })

    // project

    await db.collection('projects').createIndex({
      userId: 1
    })

    // form

    await db.collection('forms').createIndex({
      projectId: 1,
      userId: 1
    })

    await db.collection('forms').createIndex(
      {
        slug: 1
      },
      {
        unique: true
      }
    )

    // response

    await db.collection('responses').createIndex({
      createdAt: -1,
      userId: 1,
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      formId: 1
    })
  }

  return db
}

export * from './form'
export * from './models'
export * from './plan'
export * from './project'
export * from './response'
export * from './user'

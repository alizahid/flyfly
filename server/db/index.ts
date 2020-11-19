import { Db, MongoClient } from 'mongodb'

export const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const mongo = async (): Promise<Db> => {
  let db: Db

  if (!client.isConnected()) {
    await client.connect()

    db = client.db()

    // user

    db.collection('users').createIndex(
      {
        email: 1
      },
      {
        unique: true
      }
    )

    db.collection('users').createIndex({
      emailNotifications: 1
    })

    // project

    db.collection('projects').createIndex({
      userId: 1
    })

    // form

    db.collection('forms').createIndex({
      projectId: 1,
      userId: 1
    })

    db.collection('forms').createIndex(
      {
        slug: 1
      },
      {
        unique: true
      }
    )

    // response

    db.collection('responses').createIndex({
      createdAt: -1,
      userId: 1,
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      formId: 1
    })
  } else {
    db = client.db()
  }

  return db
}

export * from './form'
export * from './plan'
export * from './project'
export * from './response'
export * from './user'

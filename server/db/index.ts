import { Db, MongoClient } from 'mongodb'

export const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const mongo = async (): Promise<Db> => {
  if (!client.isConnected()) {
    await client.connect()
  }

  return client.db()
}

export * from './form'
export * from './plan'
export * from './project'
export * from './response'
export * from './user'

import { generate } from 'shortid'

export const serializeJson = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export const generateSlug = (): string => {
  const slug = generate()

  if (slug.includes('-') || slug.includes('_')) {
    return generateSlug()
  }

  return slug
}

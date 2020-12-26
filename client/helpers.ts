export const serializeJson = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export const generateSlug = (): string => 'hello'

export const parseValue = (
  data: unknown
): {
  data: string
  mono: boolean
} => {
  const result = {
    data: String(data),
    mono: false
  }

  if (Array.isArray(data)) {
    if (typeof data[0] === 'object') {
      result.mono = true
      result.data = JSON.stringify(data, null, 2)
    }

    result.data = data.join(', ')
  }

  if (typeof data === 'object') {
    result.mono = true
    result.data = JSON.stringify(data, null, 2)
  }

  if (typeof data === 'boolean') {
    result.data = data ? 'Yes' : 'No'
  }

  return result
}

export const prettyLanguageName = (language: string): string => {
  switch (language) {
    case 'js':
      return 'JavaScript'

    case 'ruby':
      return 'Ruby'

    case 'python':
      return 'Python'

    case 'php':
      return 'PHP'

    default:
      return language
  }
}

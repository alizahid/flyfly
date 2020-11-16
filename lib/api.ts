import axios from 'axios'

export const api = async <T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  body?: Record<string, string | number | boolean>
): Promise<T> => {
  const { data } = await axios.request<T>({
    data: body,
    method,
    url
  })

  return data
}

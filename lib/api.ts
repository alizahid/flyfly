import axios from 'axios'

export const apiGet = async <T>(url: string): Promise<T> => {
  const { data } = await axios.request<T>({
    method: 'get',
    url
  })

  return data
}

export const apiPost = async <T>(
  url: string,
  body?: Record<string, string | number | boolean>
): Promise<T> => {
  const { data } = await axios.request<T>({
    data: body,
    method: 'post',
    url
  })

  return data
}

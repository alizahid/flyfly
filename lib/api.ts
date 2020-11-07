import axios from 'axios'

class API {
  async post<T>(
    url: string,
    body?: Record<string, string | number | boolean>
  ): Promise<T> {
    const { data } = await axios.request<T>({
      data: body,
      method: 'post',
      url
    })

    return data
  }
}

export const api = new API()

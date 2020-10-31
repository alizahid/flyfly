import axios from 'axios'
import { GetServerSidePropsContext } from 'next'

class API {
  async get<T>(context: GetServerSidePropsContext, url: string): Promise<T> {
    const { data } = await axios.request<T>({
      headers: {
        cookie: context.req.headers.cookie
      },
      method: 'get',
      url: `${process.env.NEXTAUTH_URL}/api${url}`
    })

    return data
  }
}

export const api = new API()

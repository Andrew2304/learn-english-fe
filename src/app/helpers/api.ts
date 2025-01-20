import axios from 'axios'
import { getLocalStorage } from './localstorage'
import { USER_LOGIN_KEY } from '.'

export const isServer = () => {
  return typeof window === 'undefined'
}

export const restTransport = () => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DOMAIN_API,
    timeout: 30_000,
  })

  const fetchingToken = false

  const get = async (url: string, params = {}, config = {}) => {
    if (fetchingToken) {
      return undefined
    }
    return await client.get(url, { headers: { ...config }, params })
  }

  const post = async (url: string, data = {}, config = {}) => {
    if (fetchingToken) {
      return undefined
    }
    return await client.post(url, data, config)
  }

  const put = async (url: string, data = {}, config = {}) => {
    if (fetchingToken) {
      return undefined
    }
    return await client.put(url, data, { headers: { ...config } })
  }

  const patch = async (url: string, data = {}, config = {}) => {
    if (fetchingToken) {
      return undefined
    }
    return await client.patch(url, data, { headers: { ...config } })
  }

  const _delete = async (url: string, data = undefined, config = {}) => {
    if (fetchingToken) {
      return undefined
    }
    return await client.delete(url, {
      data,
      headers: { ...config },
    })
  }

  const rootUrl = () => client.defaults.baseURL

  // Yêu cầu đến server
  client.interceptors.request.use(
    (currentConfig) => {
      const user = getLocalStorage(USER_LOGIN_KEY);
      if (user) {
        currentConfig.headers["User-Id"] = user?.id
      }

      return currentConfig
    },
    (error) => {
      // Do something with request error
      console.error('interceptors request error=============', error)
      // return Promise.reject(error)
    },
  )

  // server phản hồi kết quả
  // client.interceptors.response.use(
  //   (response) => {
  //     return response
  //   },
  //   async (error) => {
  //     console.log(error);
  //   },
  // )

  return { get, _delete, post, put, patch, rootUrl }
}

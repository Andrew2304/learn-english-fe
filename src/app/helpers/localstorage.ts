/* eslint-disable @typescript-eslint/no-explicit-any */
export const setLocalStorage = (name: string, data: any) => {
  localStorage.setItem(name, JSON.stringify(data))
}
export const getLocalStorage = (name: string) => {
  const data = localStorage.getItem(name)

  if (data != "undefined" && data) {
    return JSON.parse(data)
  } else {
    localStorage.setItem(name, "")
    return null
  }
}

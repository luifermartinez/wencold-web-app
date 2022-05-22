export const fetcher = (url, body = null, method = "GET") => {
  const content = body ? { body: JSON.stringify(body) } : null
  return fetch(`${import.meta.env.VITE_BACKEND_API}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...content,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
}

export const fetcherAuth = (url, body = null, method = "GET") => {
  const content = body ? { body: JSON.stringify(body) } : null
  return fetch(`${import.meta.env.VITE_BACKEND_API}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...content,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
}

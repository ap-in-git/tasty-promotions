import Axios from 'axios'

const restApi = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
})

export { restApi}
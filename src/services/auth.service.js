import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const authPart = 'auth/'
const registerPart = 'registration/'
const profile = 'profile/'

export const AuthService = {
    async authenticate(data) {
        const url = backendUrl + authPart        
        const response = await axios.post(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        return response
    },

    async register(data) {
        const url = backendUrl + registerPart
        const response = await axios.post(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        return response
    },

    async getProfile(token) {
        const url = backendUrl + profile
        const response = await axios.get(url, {
            headers : {
                "Authorization" : token
            }
        })
        return response
    },

    async updateProfile(data, token) {
        const url = backendUrl + profile
        const response = await axios.put(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization" : token
            }
        })
        return response
    }
} 
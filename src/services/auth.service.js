import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const authPart = 'auth/'
const registerPart = 'registration/'

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
    }
}
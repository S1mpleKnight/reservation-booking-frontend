import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const authPart = 'auth/'

export const AuthService = {
    async authenticate(data) {
        const url = backendUrl + authPart
        
        console.log(url);
        console.log(data)
        
        const response = await axios.post(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        return response
    }
}
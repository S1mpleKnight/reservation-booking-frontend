import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const reservationPart = 'reservations/'
const url = backendUrl + reservationPart


export const ReservationService = {

    async getAll(token) {
        const response = await axios.get(url, {
            headers : {
                Authorization : token 
            }
        })
        return response
    },

    async create(data, token) {
        const response = await axios.post(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization" : token
            }
        })
        return response
    },

    async delete(id, token) {
        const deleteUrl = url + id
        const response = await axios.delete(deleteUrl, {
            headers : {
                "Authorization" : token
            }
        })
        return response
    }
}

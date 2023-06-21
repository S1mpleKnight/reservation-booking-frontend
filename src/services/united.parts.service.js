import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const offerPart = backendUrl + 'offers/'
const parts = 'parts/'

export const UnitedPartsService = {

    async getAll(token, id) {
        const url = offerPart + id + "/" + parts
        const response = await axios.get(url, {
            headers : {
                Authorization : token 
            }
        })
        return response
    },

    async create(data, token, id) {
        const url = offerPart + id + "/" + parts
        const response = await axios.post(url, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization" : token
            }
        })
        return response
    },

    async delete(id, token, deleteId) {
        const url = offerPart + id + "/" + parts + deleteId
        const response = await axios.delete(url, {
            headers : {
                "Authorization" : token
            }
        })
        return response
    }
}

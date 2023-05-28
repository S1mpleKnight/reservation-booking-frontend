import axios from "axios"

const backendUrl = process.env.REACT_APP_BACKEND_API
const countryPart = 'countries/'
const url = backendUrl + countryPart


export const CountryService = {

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

    async update(id, data) {
        const updateUrl = url + "/" + id
        const response = await axios.put(updateUrl, data, {
            headers : {
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        return response
    },

    async delete(id) {
        const deleteUrl = url + "/" + id
        const response = await axios.delete(deleteUrl)
    }
}

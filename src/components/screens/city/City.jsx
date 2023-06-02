import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import { CityService } from "../../../services/city.service" 
import NavigationBar from "../../ui/NavigationBar"

function City() {
    const [cities, setCities] = useState([])
    const [error, setError] = useState('')
    const {user} = useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)
    const [city, setCity] = useState('')

    useEffect(() => {
        setError('')
        const fetchData = async () => {
            await CityService.getAll(user.token)
                .then(function(response) {
                    setCities(response.data.content)
                })
                .catch(function (errorMessage) {
                    setError(errorMessage)
                })        
        }

        fetchData()
    }, [])

    return (
        <>
            <NavigationBar/>
        </>
    )
}

export default City
import { useContext, useEffect } from "react"
import { useState } from "react"
import { EventService } from "../../../services/event.service"
import { EstablishmentService } from "../../../services/establishment.service"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Alert} from "react-bootstrap"
import { UserService } from "../../../services/user.service"
import { AuthContext } from "../../../providers/AuthProvider"
import { CategoryService } from "../../../services/category.service"
import { OfferService } from "../../../services/offer.service"
import ReservationOffer from "../../ui/ReservationOffer"

function Offer() {
    const {user} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [contacts, setContacts] = useState([])
    const [events, setEvents] = useState([])
    const [categories, setCategories] = useState([])
    const [establishments, setEstablishments] = useState([])
    const [offers, setOffers] = useState([])

    useEffect(() => {
        const fetchContactData = async () => {
            await UserService.getAll(user.token)
                .then(function(response) {
                    setContacts(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchEvents = async () => {
            await EventService.getAll(user.token)
                .then(function(response) {
                    setEvents(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchCategories = async () => {
            await CategoryService.getAll(user.token)
                .then(function(response) {
                    setCategories(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchEstablishments = async () => {
            await EstablishmentService.getAll(user.token)
                .then(function(response) {
                    setEstablishments(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchOffers = async () => {
            await OfferService.getAll(user.token)
                .then(function(response) {
                    setOffers(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        fetchOffers()
        fetchContactData()
        fetchEvents()
        fetchCategories()
        fetchEstablishments()
    }, [])


    return (
        <>
            <NavigationBar/>
            <Container>
                <div className="d-flex justify-content-center my-3">
                    { offers.length ? (
                            offers.map(of => (
                                <ReservationOffer key={of.id} contacts={contacts} events={events} establishments={establishments} data={of}/>
                            ))

                        ) : (
                            <div className="d-flex justify-content-center">
                                <Alert variant='light'>
                                    There are no countries
                                </Alert>
                            </div>
                        ) 
                    }
                </div>
            </Container>
        </>
    )
}

export default Offer
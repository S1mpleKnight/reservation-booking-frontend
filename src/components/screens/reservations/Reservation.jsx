import { useContext, useEffect, useState } from "react"
import { ReservationService } from "../../../services/reservation.service"
import { AuthContext } from "../../../providers/AuthProvider"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Alert, Table } from "react-bootstrap"

function Reservation() {
    const [reservations, setReservations] = useState([])
    const [error, setError] = useState('')
    const {user} = useContext(AuthContext)

    useEffect(() => {
        const fetchReservations = async () => {
            await ReservationService.getPersonal(user.token)
                .then(function(response) {
                    setReservations(response.data)
                })
                .catch(function(error) {
                    setError(error)
                })
        }

        fetchReservations()
    }, [])

    const deleteReservation = async (res) => {
        setError('')
        await ReservationService.delete(res.reservation.id, user.token)
            .then(function(response) {
                const result = reservations.filter(r => r.reservation.id !== res.reservation.id)
                if (result.length === 0) {
                    setReservations([])
                } else {
                    setReservations(result)
                }
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                {error && <Alert variant='danger' className="my-2">
                    {error.response.data.message}
                </Alert>}
                <div>
                    {reservations.length ? (
                        <Table striped hover className="mt-2">
                            <tbody>
                                <tr>
                                    <th>Offer name</th>
                                    <th>Unit name</th>
                                    <th>Reservation time</th>
                                    <th>Reservation date</th>
                                    <th>Delete</th>
                                </tr>
                                {reservations.map(res => (
                                    <tr key={res.reservation.id}>
                                        <td>{res.offer.name}</td>
                                        <td>{res.unit.name}</td>
                                        <td>{res.reservation.reservationTime}</td>
                                        <td>{res.reservation.reservationDate}</td>
                                        <td className="d-flex justify-content-start">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-trash mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => deleteReservation(res)}
                                                >
                                                    <path
                                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fillRule="evenodd"
                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                ))} 
                            </tbody>
                        </Table>
                    ) : (
                        <div className="d-flex justify-content-center">
                            <Alert variant='light'>
                                There are no reservations
                            </Alert>
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default Reservation
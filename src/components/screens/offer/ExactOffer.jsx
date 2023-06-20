import { useEffect, useState } from "react";
import { OfferService } from "../../../services/offer.service";
import NavigationBar from "../../ui/NavigationBar";
import { Container, Alert, Col, Row, Image} from "react-bootstrap";
import { useParams } from "react-router-dom";

function ExactOffer() {
    const [offer, setOffer] = useState({
        contact : {
            firstname : '',
            lastname : '',
            email : ''
        },
        categories : []
    })
    const [error, setError] = useState('')
    const {id} = useParams();

    useEffect(() => {
        const fetchOffer = async () => {
            await OfferService.getById(id)
                .then(function(response) {
                    setOffer(response.data)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }

        fetchOffer()
    }, [])

        
    const getEstablishmentAddress = (est) => {
        const country = est.hasCountry ? (est.country.name + ' ') : ''
        const city = country + (est.hasCity ? (est.city.name + ' ') : '')
        const street = city + (est.hasStreet ? (est.street + ' ') : '')
        const building = street + (est.hasBuilding ? (est.building + ' ') : '')
        const apartment = building + (est.hasApartment ? est.apartment : '')
        return apartment === '' ? ('None') : apartment
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                {error && <Alert variant='danger'>
                    {error.response.data.message}
                </Alert>}
                <h2 className="d-flex align-content-center">{offer.name}</h2>
                { offer.hasEvent &&
                    <div className="border border-dark px-3 py-2 mt-3">    
                        <Row>
                            <Col>
                                <p>Event title : {offer.event.title}</p>
                            </Col>
                            <Col>
                                <p>Start date: {offer.event.startDate}</p>
                            </Col>
                            { offer.event.hasEndDate && 
                                <Col>
                                    <p>End date : {offer.event.endDate}</p>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <p>Description : {offer.event.description}</p>
                            </Col>
                        </Row>
                        <Row>
                            {offer.event.hasTime && 
                                <Col>
                                    <p>Event time : {offer.event.time}</p>
                                </Col>
                            }
                            <Col>
                                <p>Event contact : {offer.event.contact.email}</p>
                            </Col>
                        </Row>
                    </div>
                }
                { offer.hasEstablishment && 
                    <div className="border border-dark px-3 py-2 mt-3">   
                        <Row>
                            <Col>
                                <p>Establishment contact: {offer.establishment.contact.email}</p>
                            </Col>
                        </Row>    
                        <Row>
                            <Col>
                                <p>Establishment address : {getEstablishmentAddress(offer.hasEstablishment)}</p>
                            </Col>
                        </Row>
                    </div>
                }
                { offer.hasAdditionalInfo && 
                    <div className="border border-dark px-3 py-2 mt-3">   
                        <Row>
                            <Col>
                                <Image src={offer.additionalOfferInfo.imageUrl} alt="Offer image" style={{ maxWidth: '100vh' }}/>
                            </Col>
                            <Col>
                                <div>
                                    <a href={offer.additionalOfferInfo.establishmentUrl}>Establishment link</a>        
                                </div>
                                <div>
                                    <a href={offer.additionalOfferInfo.eventUrl}>Event link</a>
                                </div>
                            </Col>
                        </Row>   
                    </div>
                }
                <div className="border border-dark px-3 py-2 mt-3">  
                        <Row>
                            <Col>
                                <p>Contact: {offer.contact.firstname + " " + offer.contact.lastname}</p>
                            </Col>
                            <Col>
                                <p>Email: {offer.contact.email}</p>
                            </Col>
                        </Row> 
                        <Row>
                            <Col>
                                <div>
                                    <p>Reservation offer date: {offer.reservationDate}</p>        
                                </div>
                            </Col>
                            { offer.hasTime && 
                                <Col>
                                    <div>
                                        <p>Reservation time : {offer.reservationTime}</p>
                                    </div>
                                </Col>
                            }
                        </Row>  
                        { offer.categories.length > 0 && 
                            <Row>
                                <Col>
                                    <p>Categories: 
                                        {offer.categories.map(c => (
                                            <span key={c.id}>{" " + c.name}</span>
                                        ))}
                                    </p>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <p>Reservation offer type: {offer.reservationType}</p>
                            </Col>
                            { offer.reservationType === 'ORDER' &&
                                <Col>
                                    <p>Order type: {offer.orderType}</p>
                                </Col>
                            }
                            <Col>
                                <p>Progress status: {offer.offerStatus}</p>
                            </Col>
                        </Row>
                    </div>
            </Container>
        </>
    )
}

export default ExactOffer;
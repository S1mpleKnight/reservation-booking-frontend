import { useContext, useState } from "react"
import { AuthContext } from "../../providers/AuthProvider"
import { Button, Card, Col, FormGroup, Modal, Row, Alert, Form} from "react-bootstrap"
import { OfferService } from "../../services/offer.service"

function ReservationOffer(props) {
    const [updateError, setUpdateError] = useState('')
    const [offer, setOffer] = useState(props.data)
    const [offerUpdate, setOfferUpdate] = useState({
        event: {
            title : '',
            id: ''
        },
        eventId: '',
        hasTime: false,
        reservationTime: '',
        name: '',
        contactId: '',
        contact : {
            id: '',
            username: ''
        },
        establishment : {
            id: ''
        },
        establishmentId: '',
        offerStatus: 'NOT_OPEN',
        imageUrl : '',
        establishmentUrl : '',
        eventUrl : '',
    })
    const {user} = useContext(AuthContext)
    const [contacts] = useState(props.contacts)
    const [events] = useState(props.events)
    const [establishments] = useState(props.establishments) 
    const [showModal, setShowModal] = useState(false)

    const handleCloseModal = () => {
        setShowModal(false)
        setUpdateError('')
        setOfferUpdate({
            event: {
                title : '',
                id: ''
            },
            eventId: '',
            hasTime: false,
            reservationTime: '',
            name: '',
            contactId: '',
            contact : {
                id: '',
                username: ''
            },
            establishment : {
                id: ''
            },
            establishmentId: '',
            offerStatus: 'NOT_OPEN',
            imageUrl : '',
            establishmentUrl : '',
            eventUrl : ''
        })
    }

    const handleOpenModal = () => {
        setShowModal(true)
        setOfferUpdate(offer)
    }

    const updateOffer = async () => {
        if (!offerUpdate.hasTime) {
            setOfferUpdate(prev => ({
                ...prev, reservationTime : ''
            }))
        }
        setOfferUpdate(prev => ({
            ...prev, 'additionalOfferInfo' : {
                imageUrl : offerUpdate.imageUrl,
                eventUrl : offerUpdate.eventUrl,
                establishmentUrl : offerUpdate.establishmentUrl
            } 
        }))
        console.log(offerUpdate)
        await OfferService.update(offer.id, offerUpdate, user.token)
            .then(function(response) {
                setOffer(response.data)
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                setUpdateError(errorMessage)
            })
    }

    const changeEvent = (e) => {
        const eventName = e.target.value
        if (events.length > 0) {
            const resultEvent = events.find(e => e.title === eventName)
            setOfferUpdate(prev => ({
                ...prev, event : resultEvent, eventId : resultEvent.id
            }))
        }
    }

    const changeEstablishment = (e) => {
        const establishmentKey = e.target.options.selectedIndex
        if (establishments.length > 0) {
            const resultEstablishment = establishments[establishmentKey]
            setOfferUpdate(prev => ({
                ...prev, establishment : resultEstablishment, establishmentId : resultEstablishment.id
            }))
        }
    }

    const changeContact = (e) => {
        const contactName = e.target.value
        if (contacts.length > 0) {
            const resultContact = contacts.find(u => u.username === contactName)
            setOfferUpdate(prev => ({
                ...prev, contact : resultContact, contactId : resultContact.id
            }))
        }
    }

    const changeReservationType = (e) => {
        if (e.target.value !== 'PLACE') {
            setOfferUpdate(prev => ({
                ...prev, reservationType: e.target.value, orderType: 'NONE'
            }))
        } else {
            setOfferUpdate(prev => ({
                ...prev, reservationType: e.target.value
            }))
        }
    }
    
    const getEstablishmentAddress = (est) => {
        const country = est.hasCountry ? (est.country.name + ' ') : ''
        const city = country + (est.hasCity ? (est.city.name + ' ') : '')
        const street = city + (est.hasStreet ? (est.street + ' ') : '')
        const building = street + (est.hasBuilding ? (est.building + ' ') : '')
        const apartment = building + (est.hasApartment ? est.apartment : '')
        return apartment
    }

    const changeHasEvent = (e) => {
        if (events.length) {
            setOfferUpdate(prev => ({
                ...prev, hasEvent : e.target.checked     
            }))
            if (e.target.checked && !offerUpdate.event) {
                setOfferUpdate(prev => ({
                    ...prev, event : events[0], eventId : events[0].id
                }))
            }
        } else {
            setOfferUpdate(prev => ({
                ...prev, hasEvent : false, event : {
                    title : '',
                    id : ''
                }     
            }))
        }
    }

    const changeHasEstablishment = (e) => {
        if (establishments.length) {
            setOfferUpdate(prev => ({
                ...prev, hasEstablishment : e.target.checked     
            }))
            if (e.target.checked && !offerUpdate.establishment) {
                setOfferUpdate(prev => ({
                    ...prev, establishment : establishments[0], establishmentId : establishments[0].id
                }))
            }
        } else {
            setOfferUpdate(prev => ({
                ...prev, hasEstablishment : false, establishment : {
                    id : '',
                    country : {
                        name : ''
                    },
                    city : {
                        name : ''
                    },
                    street : '',
                    building : '',
                    apartment : ''
                }     
            }))
        }
    }

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    Update offer
                </Modal.Header>
                <Modal.Body>
                    {updateError && <Alert variant='danger'>
                        {updateError.response.data.message}
                    </Alert>}
                    <Form>
                        <Row>
                            <Col>
                                <FormGroup className="hasEvent">
                                    <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has event?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={offerUpdate.hasEvent} 
                                                onChange={e => changeHasEvent(e)}/>
                                        </div>
                                </FormGroup>
                            </Col>
                            {offerUpdate.hasEvent &&
                                <Col>
                                    <FormGroup className="event">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Event</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                                onChange={e => changeEvent(e)}
                                                value={offerUpdate.event.title}>
                                                {events.map(eve => (
                                                    <option key={eve.id}>{eve.title}</option>
                                                ))}
                                           </Form.Select>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup controlId="name">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Offer name</Form.Label>
                                    </div>
                                    <Form.Control 
                                        placeholder="Enter offer name" 
                                        value={offerUpdate.title}
                                        type="text"
                                        onChange={e => setOfferUpdate(prev => ({
                                            ...prev, name : e.target.value
                                        }))}/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Form.Group controlId="reservationDate">
                                    <Form.Label className="d-flex justify-content-center">
                                        Date
                                    </Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Format yyyy-mm-dd" 
                                        onChange={e => setOfferUpdate(prev => ({
                                            ...prev, reservationDate : e.target.value
                                        }))}
                                        value={offerUpdate.reservationDate}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup className="hasTime">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has time?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={offerUpdate.hasTime} 
                                            onChange={e => setOfferUpdate(prev => ({
                                                ...prev, hasTime : e.target.checked
                                        }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            {offerUpdate.hasTime &&
                                <Col>
                                    <FormGroup className="time">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Time</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter time in format hh:mm" 
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, reservationTime : e.target.value
                                                }))}
                                                value={offerUpdate.reservationTime}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup className="hasEstablishment">
                                    <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has establishment?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={offerUpdate.hasEstablishment} 
                                                onChange={e => changeHasEstablishment(e)}/>
                                        </div>
                                </FormGroup>
                            </Col>
                            {offerUpdate.hasEstablishment &&
                                <Col>
                                    <FormGroup className="event">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Establishment</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                                onChange={e => changeEstablishment(e)}
                                                value={getEstablishmentAddress(offerUpdate.establishment)}>
                                                {establishments.map(est => (
                                                    <option key={est.id}>{getEstablishmentAddress(est)}</option>
                                                ))}
                                           </Form.Select>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup className="hasAdditionalInfo">
                                    <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has additional info?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={offerUpdate.hasAdditionalInfo} 
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, hasAdditionalInfo : e.target.checked     
                                                }))}/>
                                        </div>
                                </FormGroup>
                            </Col>
                            {offerUpdate.hasAdditionalInfo &&
                                <Col>
                                    <FormGroup className="imageUrl">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Image url</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter image url" 
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, imageUrl : e.target.value
                                                }))}
                                                value={offerUpdate.imageUrl}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        {offerUpdate.hasAdditionalInfo &&
                            <Row>
                                <Col>
                                    <FormGroup className="establishmentUrl">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Establishment url</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter establishment url" 
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, establishmentUrl : e.target.value
                                                }))}
                                                value={offerUpdate.establishmentUrl}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup className="eventUrl">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Event url</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter event url" 
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, eventUrl : e.target.value
                                                }))}
                                                value={offerUpdate.eventUrl}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <FormGroup className="userId">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Select Contact</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Select
                                        onChange={e => changeContact(e)}
                                        value={offerUpdate.contact.username}>
                                            {contacts.map(user => (
                                                <option key={user.id}>{user.username}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label>Select offer type</Form.Label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Select value={offerUpdate.reservationType}
                                                onChange={e => changeReservationType(e)}>
                                        <option>PLACE</option>
                                        <option>SUBJECT</option>
                                        <option>ORDER</option>
                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>
                        { offerUpdate.reservationType === 'ORDER' && 
                            <Row>
                                <Col>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Select order type</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Select value={offerUpdate.orderType}
                                                    onChange={e => setOfferUpdate(prev => ({
                                                        ...prev, orderType: e.target.value
                                                    }))}>
                                            <option>TIME</option>
                                            <option>NUMBER</option>
                                            <option>TIME_AND_NUMBER</option>
                                            <option>NONE</option>
                                        </Form.Select>
                                    </div>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label>Select offer status</Form.Label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Select value={offerUpdate.offerStatus}
                                                onChange={e => setOfferUpdate(prev => ({
                                                    ...prev, offerStatus: e.target.value
                                                }))}>
                                        <option>NOT_OPEN</option>
                                        <option>OPEN</option>
                                        <option>CLOSED</option>
                                    </Form.Select>
                                </div>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-center mt-3"> 
                            <Button onClick={e => updateOffer()}>
                                Update
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Card>
                <Card.Header>{offer.name}</Card.Header>
                <Row>
                    <Col>
                        { offer.hasAdditionalInfo && offer.additionalOfferInfo && offer.additionalOfferInfo.imageUrl &&
                        <Card.Body>
                            <Card.Img variant="top" src={offer.additionalOfferInfo.imageUrl}/>
                        </Card.Body>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        { offer.hasEvent &&
                        <Card.Body>
                            <Card.Title>{offer.event.title}</Card.Title>
                            <Card.Text>{offer.event.description}</Card.Text>
                        </Card.Body>
                        }
                    </Col>
                </Row>
                
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                <div>
                                    <p>Date: <p>{offer.reservationDate}</p></p>
                                </div>
                            </Col>
                            <Col>
                                { offer.hasTime && 
                                <div>
                                    <p>Time: <p>{offer.reservationTime}</p></p>
                                </div>
                                }
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
                { offer.categories.length > 0 &&
                    <Card.Body>
                        {offer.categories.map(cat => (
                            <div key={cat.id}>{cat.name}</div>
                        ))}
                    </Card.Body>
                }
                <Card.Body>
                    <Card.Title>
                        {offer.offerStatus === 'NOT_OPEN' 
                            ? ('Not open') 
                            : (offer.offerStatus === 'OPEN') 
                                ? ('Open')
                                : ('Closed')
                        }
                    </Card.Title>
                </Card.Body>
                <Button onClick={() => handleOpenModal()}>
                    Update
                </Button>
            </Card>
        </>
    )
}

export default ReservationOffer
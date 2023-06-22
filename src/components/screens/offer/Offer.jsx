import { useContext, useEffect } from "react"
import { useState } from "react"
import { EventService } from "../../../services/event.service"
import { EstablishmentService } from "../../../services/establishment.service"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Alert, Form, Col, FormGroup, Row, Button} from "react-bootstrap"
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
    const [showCreate, setShowCreate] = useState(false)
    const [showFind, setShowFind] = useState(false)
    const [filter, setFilter] = useState({
        hasEvent: '',
        events : [],
        eventIds : [],
        dateForm : '',
        dateTo : '',
        hasTime : '',
        timeFrom : '',
        timeTo : '',
        categories : [],
        categoryIds : [],
        reservationTypes : [],
        orderReservationTypes : [],
        contacts : [],
        contactIds : [],
        hasEstablishment : '',
        establishments : [], 
        establishmentIds : [],
        statuses : []
    })
    const [offer, setOffer] = useState({
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
        categories : [],
        categoryIds : [],
        additionalOfferInfo : {
            imageUrl: '',
            eventUrl : '',
            establishmentUrl : ''
        }
    })

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

    
    const changeEvent = (e) => {
        const eventName = e.target.value
        if (events.length > 0) {
            const resultEvent = events.find(e => e.title === eventName)
            setOffer(prev => ({
                ...prev, event : resultEvent, eventId : resultEvent.id
            }))
        }
    }

    const changeEstablishment = (e) => {
        const establishmentKey = e.target.options.selectedIndex
        if (establishments.length > 0) {
            const resultEstablishment = establishments[establishmentKey]
            setOffer(prev => ({
                ...prev, establishment : resultEstablishment, establishmentId : resultEstablishment.id
            }))
        }
    }

    const changeContact = (e) => {
        const contactName = e.target.value
        if (contacts.length > 0) {
            const resultContact = contacts.find(u => u.username === contactName)
            setOffer(prev => ({
                ...prev, contact : resultContact, contactId : resultContact.id
            }))
        }
    }

    const changeCategories = (e) => {
        setOffer(prev => ({
            ...prev, categories : [].slice.call(e.target.selectedOptions).map(item => item.value)
        }))
        const selectedCategories = [].slice.call(e.target.selectedOptions).map(item => item.value)
        if (categories.length > 0) {
            const chosenCategories = []
            for (var i = 0; i < selectedCategories.length; i++) {
                const chosenCategory = categories.find(c => c.name === selectedCategories[i])
                chosenCategories.push(chosenCategory) 
            }
            setOffer(prev => ({
                ...prev, categories : chosenCategories, categoryIds : chosenCategories.map(c => c.id)
            }))
        }
    }

    const changeReservationType = (e) => {
        if (e.target.value !== 'PLACE') {
            setOffer(prev => ({
                ...prev, reservationType: e.target.value, orderType: 'NONE'
            }))
        } else {
            setOffer(prev => ({
                ...prev, reservationType: e.target.value
            }))
        }
    }

    const changeFilterReservationType = (e) => {
        if (e.target.value !== 'PLACE') {
            setFilter(prev => ({
                ...prev, reservationType: e.target.value, orderType: 'NONE'
            }))
        } else {
            setFilter(prev => ({
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
            setOffer(prev => ({
                ...prev, hasEvent : e.target.checked     
            }))
            if (e.target.checked && !offer.event) {
                setOffer(prev => ({
                    ...prev, event : events[0], eventId : events[0].id
                }))
            }
        } else {
            setOffer(prev => ({
                ...prev, hasEvent : false, event : {
                    title : '',
                    id : ''
                }     
            }))
        }
    }

    const changeHasEstablishment = (e) => {
        if (establishments.length) {
            setOffer(prev => ({
                ...prev, hasEstablishment : e.target.checked     
            }))
            if (e.target.checked && !offer.establishment) {
                setOffer(prev => ({
                    ...prev, establishment : establishments[0], establishmentId : establishments[0].id
                }))
            }
        } else {
            setOffer(prev => ({
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

    const createOffer = async () => {
        setError('')
        if (!offer.hasTime) {
            setOffer(prev => ({
                ...prev, reservationTime : ''
            }))
        }
        await OfferService.create(offer, user.token)
            .then(function(response) {
                setOffers(prev => ([
                    ...prev, response.data
                ]))
                setOffer({
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
                    categories : [],
                    categoryIds : []
                })
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const changeFilterHasEvent = (e) => {
        if (events.length) {
            setFilter(prev => ({
                ...prev, hasEvent : e.target.checked     
            }))
            if (!e.target.checked) {
                setFilter(prev => ({
                    ...prev, eventIds : []
                }))
            }
        } else {
            setOffer(prev => ({
                ...prev, hasEvent : false, eventIds : []
            }))
        }
    }

    const changeFilterHasEstablishment = (e) => {
        if (establishments.length) {
            setFilter(prev => ({
                ...prev, hasEstablishment : e.target.checked     
            }))
            if (!e.target.checked) {
                setFilter(prev => ({
                    ...prev, establishmentIds : []
                }))
            }
        } else {
            setOffer(prev => ({
                ...prev, hasEstablishment : false, establishmentIds : []
            }))
        }
    }

    const changeFilterEvents = (e) => {
        const selectedEvents = [].slice.call(e.target.selectedOptions).map(item => item.value)
        if (events.length > 0) {
            const chosenEvents = []
            for (var i = 0; i < selectedEvents.length; i++) {
                const chosenEvent = events.find(event => event.title === selectedEvents[i])
                chosenEvents.push(chosenEvent) 
            }
            setFilter(prev => ({
                ...prev, events : chosenEvents, eventIds : chosenEvents.map(event => event.id)
            }))
        }
    }

    const changeFilterContacts = (e) => {
        const selectedContacts = [].slice.call(e.target.selectedOptions).map(item => item.value)
        if (contacts.length > 0) {
            const chosenContacts = []
            for (var i = 0; i < selectedContacts.length; i++) {
                const chosenContact = contacts.find(c => c.username === selectedContacts[i])
                chosenContacts.push(chosenContact) 
            }
            setFilter(prev => ({
                ...prev, contacts : chosenContacts, contactIds : chosenContacts.map(c => c.id)
            }))
        }
    }
    
    const changeFilterCategories = (e) => {
        const selectedCategories = [].slice.call(e.target.selectedOptions).map(item => item.value)
        if (categories.length > 0) {
            const chosenCategories = []
            for (var i = 0; i < selectedCategories.length; i++) {
                const chosenCategory = categories.find(c => c.name === selectedCategories[i])
                chosenCategories.push(chosenCategory) 
            }
            setFilter(prev => ({
                ...prev, categories : chosenCategories, categoryIds : chosenCategories.map(c => c.id)
            }))
        }
    }

    const changeFilterEstablishments = (e) => {
        const selectedEstablishments = [].slice.call(e.target.selectedOptions).map(item => item.value)
        if (establishments.length > 0) {
            const chosenEstablishments = []
            for (var i = 0; i < selectedEstablishments.length; i++) {
                const chosenEstablishment = establishments.find(est => getEstablishmentAddress(est) === selectedEstablishments[i])
                chosenEstablishments.push(chosenEstablishment) 
            }
            setFilter(prev => ({
                ...prev, establishments : chosenEstablishments, establishmentIds: chosenEstablishments.map(est => est.id)
            }))
        }
    }

    const searchFiltered = async (e) => {
        e.preventDefault()
        await OfferService.getAllFiltered(filter, user.token)
            .then(function(response) {
                setOffers(response.data.content)
                setFilter({
                    hasEvent: '',
                    events : [],
                    eventIds : [],
                    dateForm : '',
                    dateTo : '',
                    hasTime : '',
                    timeFrom : '',
                    timeTo : '',
                    categories : [],
                    categoryIds : [],
                    reservationTypes : [],
                    orderReservationTypes : [],
                    contacts : [],
                    contactIds : [],
                    hasEstablishment : '',
                    establishments : [], 
                    establishmentIds : [],
                    statuses : []
                })
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                <div className="d-flex justify-content-center my-3">
                    {error && <Alert variant='danger'>
                        {error.response.data.message}
                    </Alert>}
                </div>
                    <div>
                        <Row>
                            <Col>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label>Show create panel</Form.Label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Check 
                                        type="switch" 
                                        value={showCreate} 
                                        onChange={e => setShowCreate(e.target.checked)}/>
                                </div>
                            </Col>
                            <Col>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label>Show search panel</Form.Label>
                                </div>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Check 
                                        type="switch" 
                                        value={showFind} 
                                        onChange={e => setShowFind(e.target.checked)}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    { showFind &&
                        <div>
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
                                                        value={filter.hasEvent} 
                                                        onChange={e => changeFilterHasEvent(e)}/>
                                                </div>
                                        </FormGroup>
                                    </Col>
                                    { filter.hasEvent && 
                                        <Col>
                                            <FormGroup className="eventIds">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Select events</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        as="select"
                                                        multiple
                                                        onChange={e => changeFilterEvents(e)}
                                                        value={filter.events.map(e => e.title)}>
                                                            {events.map(event => (
                                                                <option key={event.id}>{event.title}</option>
                                                            ))}
                                                    </Form.Control>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    } 
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="dateFrom">
                                            <Form.Label className="d-flex justify-content-center">
                                                Date from
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Format yyyy-mm-dd" 
                                                onChange={e => setFilter(prev => ({
                                                    ...prev, dateForm : e.target.value
                                                }))}
                                                value={filter.dateForm}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="dateTo">
                                            <Form.Label className="d-flex justify-content-center">
                                                Date to
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Format yyyy-mm-dd" 
                                                onChange={e => setFilter(prev => ({
                                                    ...prev, dateTo : e.target.value
                                                }))}
                                                value={filter.dateTo}/>
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
                                                    value={filter.hasTime} 
                                                    onChange={e => setFilter(prev => ({
                                                        ...prev, hasTime : e.target.checked
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    {filter.hasTime &&
                                        <Col>
                                            <FormGroup className="timeFrom">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Time from</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Enter time from in format hh:mm" 
                                                        onChange={e => setFilter(prev => ({
                                                            ...prev, timeFrom : e.target.value
                                                        }))}
                                                        value={filter.timeFrom}/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    }
                                    {filter.hasTime &&
                                        <Col>
                                            <FormGroup className="timeTo">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Time to</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Enter time to in format hh:mm" 
                                                        onChange={e => setFilter(prev => ({
                                                            ...prev, timeTo : e.target.value
                                                        }))}
                                                        value={filter.timeTo}/>
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
                                                        value={filter.hasEstablishment} 
                                                        onChange={e => changeFilterHasEstablishment(e)}/>
                                                </div>
                                        </FormGroup>
                                    </Col>
                                    { filter.hasEstablishment && 
                                        <Col>
                                            <FormGroup className="establishmentIds">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Select establishments</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        as="select"
                                                        multiple
                                                        onChange={e => changeFilterEstablishments(e)}
                                                        value={filter.establishments.map(e => getEstablishmentAddress(e))}>
                                                            {establishments.map(est => (
                                                                <option key={est.id}>{getEstablishmentAddress(est)}</option>
                                                            ))}
                                                    </Form.Control>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    } 
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup className="contactIds">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select contacts</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    as="select"
                                                    multiple
                                                    onChange={e => changeFilterContacts(e)}
                                                    value={filter.contacts.map(c => c.username)}>
                                                        {contacts.map(contact => (
                                                            <option key={contact.id}>{contact.username}</option>
                                                        ))}
                                                </Form.Control>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    <Col>
                                        <FormGroup className="categoryIds">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select categories</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    as="select"
                                                    multiple
                                                    onChange={e => changeFilterCategories(e)}
                                                    value={filter.categories.map(c => c.name)}>
                                                        {categories.map(category => (
                                                            <option key={category.id}>{category.name}</option>
                                                        ))}
                                                </Form.Control>
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
                                            <Form.Select value={filter.reservationType}
                                                        onChange={e => changeFilterReservationType(e)}>
                                                <option>PLACE</option>
                                                <option>SUBJECT</option>
                                                <option>ORDER</option>
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    { filter.reservationType === 'ORDER' && 
                                        <Col>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select order type</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select value={filter.orderReservationTypes}
                                                            onChange={e => setFilter(prev => ({
                                                                ...prev, orderReservationTypes: e.target.value
                                                            }))}>
                                                    <option>TIME</option>
                                                    <option>NUMBER</option>
                                                    <option>TIME_AND_NUMBER</option>
                                                    <option>NONE</option>
                                                </Form.Select>
                                            </div>
                                        </Col>
                                    }
                                    <Col>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Select offer statuses</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select value={filter.statuses}
                                                        onChange={e => setFilter(prev => ({
                                                            ...prev, statuses: e.target.value
                                                        }))}>
                                                <option>NOT_OPEN</option>
                                                <option>OPEN</option>
                                                <option>CLOSED</option>
                                            </Form.Select>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-center mt-3"> 
                                    <Button onClick={e => searchFiltered(e)}>
                                        Search
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    }
                    { showCreate && 
                        <div>
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
                                                        value={offer.hasEvent} 
                                                        onChange={e => changeHasEvent(e)}/>
                                                </div>
                                        </FormGroup>
                                    </Col>
                                    {offer.hasEvent &&
                                        <Col>
                                            <FormGroup className="event">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Event</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Select
                                                        onChange={e => changeEvent(e)}
                                                        value={offer.event.title}>
                                                        {events.map(eve => (
                                                            <option key={eve.id}>{eve.title}</option>
                                                        ))}
                                                </Form.Select>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    }
                                    <Col>
                                        <FormGroup controlId="name">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Offer name</Form.Label>
                                            </div>
                                            <Form.Control 
                                                placeholder="Enter offer name" 
                                                value={offer.title}
                                                type="text"
                                                onChange={e => setOffer(prev => ({
                                                    ...prev, name : e.target.value
                                                }))}/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="reservationDate">
                                            <Form.Label className="d-flex justify-content-center">
                                                Date
                                            </Form.Label>
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Format yyyy-mm-dd" 
                                                onChange={e => setOffer(prev => ({
                                                    ...prev, reservationDate : e.target.value
                                                }))}
                                                value={offer.reservationDate}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <FormGroup className="hasTime">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Has time?</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Check 
                                                    type="switch" 
                                                    value={offer.hasTime} 
                                                    onChange={e => setOffer(prev => ({
                                                        ...prev, hasTime : e.target.checked
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                    {offer.hasTime &&
                                        <Col>
                                            <FormGroup className="time">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Time</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Enter time in format hh:mm" 
                                                        onChange={e => setOffer(prev => ({
                                                            ...prev, reservationTime : e.target.value
                                                        }))}
                                                        value={offer.reservationTime}/>
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
                                                        value={offer.hasEstablishment} 
                                                        onChange={e => changeHasEstablishment(e)}/>
                                                </div>
                                        </FormGroup>
                                    </Col>
                                    {offer.hasEstablishment &&
                                        <Col>
                                            <FormGroup className="event">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Establishment</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Select
                                                        onChange={e => changeEstablishment(e)}
                                                        value={getEstablishmentAddress(offer.establishment)}>
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
                                                        value={offer.hasAdditionalInfo} 
                                                        onChange={e => setOffer(prev => ({
                                                            ...prev, hasAdditionalInfo : e.target.checked     
                                                        }))}/>
                                                </div>
                                        </FormGroup>
                                    </Col>
                                    {offer.hasAdditionalInfo &&
                                        <Col>
                                            <FormGroup className="imageUrl">
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Label>Image url</Form.Label>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Enter image url" 
                                                        onChange={e => setOffer({
                                                            ...offer,
                                                            additionalOfferInfo: {
                                                                ...offer.additionalOfferInfo,
                                                                imageUrl : e.target.value 
                                                            } 
                                                        })}
                                                        value={offer.additionalOfferInfo.imageUrl}/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    }
                                </Row>
                                {offer.hasAdditionalInfo &&
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
                                                        onChange={e => setOffer(({
                                                            ...offer, 
                                                            additionalOfferInfo: {
                                                                ...offer.additionalOfferInfo,
                                                                establishmentUrl : e.target.value 
                                                            } 
                                                        }))}
                                                        value={offer.additionalOfferInfo.establishmentUrl}/>
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
                                                        onChange={e => setOffer(({
                                                            ...offer, 
                                                            additionalOfferInfo: {
                                                                ...offer.additionalOfferInfo,
                                                                eventUrl : e.target.value 
                                                            } 
                                                        }))}
                                                        value={offer.additionalOfferInfo.eventUrl}/>
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col>
                                        <FormGroup className="categoryIds">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select categories</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    as="select"
                                                    multiple
                                                    onChange={e => changeCategories(e)}
                                                    value={offer.categories.map(c => c.name)}>
                                                        {categories.map(category => (
                                                            <option key={category.id}>{category.name}</option>
                                                        ))}
                                                </Form.Control>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <FormGroup className="userId">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select Contact</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select
                                                onChange={e => changeContact(e)}
                                                value={offer.contact.username}>
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
                                            <Form.Select value={offer.reservationType}
                                                        onChange={e => changeReservationType(e)}>
                                                <option>PLACE</option>
                                                <option>SUBJECT</option>
                                                <option>ORDER</option>
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    { offer.reservationType === 'ORDER' && 
                                        <Col>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select order type</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select value={offer.orderType}
                                                            onChange={e => setOffer(prev => ({
                                                                ...prev, orderType: e.target.value
                                                            }))}>
                                                    <option>TIME</option>
                                                    <option>NUMBER</option>
                                                    <option>TIME_AND_NUMBER</option>
                                                    <option>NONE</option>
                                                </Form.Select>
                                            </div>
                                        </Col>
                                    }
                                    <Col>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Select offer status</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select value={offer.offerStatus}
                                                        onChange={e => setOffer(prev => ({
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
                                    <Button onClick={e => createOffer()}>
                                        Create
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    }
                <div className="d-flex justify-content-center my-3">
                    { offers.length ? (
                            offers.map(of => (
                                <ReservationOffer key={of.id} contacts={contacts} events={events} establishments={establishments} data={of} categories={categories}/>
                            ))

                        ) : (
                            <div className="d-flex justify-content-center">
                                <Alert variant='light'>
                                    There are no offers
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
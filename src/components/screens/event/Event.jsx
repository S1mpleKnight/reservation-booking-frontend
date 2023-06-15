import { useEffect, useState } from "react"
import { useContext } from "react"
import { EventService } from "../../../services/event.service"
import { AuthContext } from "../../../providers/AuthProvider"
import { UserService } from "../../../services/user.service"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Form, Alert, FormGroup, Row, Col, Button, Table, Modal} from "react-bootstrap"

function Event() {
    const {user} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [event, setEvent] = useState({
        contactId: '',
        contact : {
            username : ''
        },
        hasEndDate : false,
        hasTime: false
    })
    const [events, setEvents] = useState([])
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        const fetchEventData = async () => {
            await EventService.getAll(user.token)
                .then(function(response) {
                    setEvents(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchContactData = async () => {
            await UserService.getAll(user.token)
                .then(function(response) {
                    setUsers(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }

        fetchEventData()
        fetchContactData()
    }, [])

    const createEvent = async () => {
        setError('')
        await EventService.create(event, user.token)
            .then(function(response) {
                setEvents([
                    ...events, response.data
                ])
            })       
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const updateEvent = async () => {
        setUpdateError('')
        await EventService.update(event.id, event, user.token)
            .then(function(response) {
                setEvents([
                    ...events.filter(e => e.id !== response.data.id), response.data
                ])
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                setUpdateError(errorMessage)
            })
    }

    const deleteEvent = async (eventData) => {
        setError('')
        await EventService.delete(eventData.id, user.token)
            .then(function() {
                setEvents([
                    ...events.filter(e => e.id !== eventData.id)
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const changeContact = (e) => {
        const contactName = e.target.value
        if (users.length > 0) {
            const resultContact = users.find(u => u.username === contactName)
            setEvent(prev => ({
                ...prev, contact : resultContact, contactId : resultContact.id
            }))
        }
    }

    const handleOpenModal = (eventData) => {
        setError('')
        setShowModal(true)
        setEvent(eventData)
        setEvent(prev => ({
            ...prev, contactId : prev.contact.id
        }))
    }

    const handleCloseModal = () => {
        setUpdateError('')
        setShowModal(false)
        setEvent({
            contactId: '',
            contact : {
                username : ''
            },
            hasEndDate : false,
            hasTime: false
        })
    }

    return (
        <>
            <NavigationBar/>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateError && <Alert variant='danger'>
                        {updateError.response.data.message}
                    </Alert>}
                    <Form>
                    <FormGroup className="userId">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Select Contact</Form.Label>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Select
                                onChange={e => changeContact(e)}
                                value={event.contact.username}>
                                    {users.map(user => (
                                        <option key={user.id}>{user.username}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </FormGroup>
                        <Row>
                            <Col>
                                <FormGroup controlId="title">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Event title</Form.Label>
                                    </div>
                                    <Form.Control 
                                        placeholder="Enter event title" 
                                        value={event.title}
                                        type="text"
                                        onChange={e => setEvent(prev => ({
                                            ...prev, title : e.target.value
                                        }))}/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Form.Group controlId="startDate">
                                    <Form.Label className="d-flex justify-content-center">
                                        Start date
                                    </Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Format yyyy-mm-dd" 
                                        onChange={e => setEvent(prev => ({
                                            ...prev, startDate : e.target.value
                                        }))}
                                        value={event.startDate}/>
                                </Form.Group> 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup className="hasEndDate">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has end date?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={event.hasEndDate} 
                                            onChange={e => setEvent(prev => ({
                                                ...prev, hasEndDate : e.target.checked     
                                            }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            {event.hasEndDate &&
                                <Col>
                                    <FormGroup className="endDate">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>End date</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter date in format yyyy-mm-dd" 
                                                onChange={e => setEvent(prev => ({
                                                    ...prev, endDate : e.target.value
                                                }))}
                                                value={event.endDate}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
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
                                            value={event.hasTime} 
                                            onChange={e => setEvent(prev => ({
                                                ...prev, hasTime : e.target.checked, time : ''
                                        }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            {event.hasTime &&
                                <Col>
                                    <FormGroup className="time">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Time</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter time in format hh:mm" 
                                                onChange={e => setEvent(prev => ({
                                                    ...prev, time : e.target.value
                                                }))}
                                                value={event.time}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <FormGroup className="description">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Description</Form.Label>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    placeholder="Enter description" 
                                    onChange={e => setEvent(prev => ({
                                        ...prev, description : e.target.value
                                    }))}
                                    value={event.description}/>
                            </div>
                        </FormGroup>
                        <div className="d-flex justify-content-center">
                            <Button className="mt-2" onClick={() => updateEvent()}>
                                Update
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Container>
                <div className="d-flex justify-content-center my-3">
                    <Form>
                        {error && <Alert variant='danger'>
                            {error.response.data.message}
                        </Alert>}
                        <FormGroup className="userId">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Select Contact</Form.Label>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Select
                                onChange={e => changeContact(e)}
                                value={event.contact.username}>
                                    {users.map(user => (
                                        <option key={user.id}>{user.username}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </FormGroup>
                        <Row>
                            <Col>
                                <FormGroup controlId="title">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Event title</Form.Label>
                                    </div>
                                    <Form.Control 
                                        placeholder="Enter event title" 
                                        value={event.title}
                                        type="text"
                                        onChange={e => setEvent(prev => ({
                                            ...prev, title : e.target.value
                                        }))}/>
                                </FormGroup>
                            </Col>
                            <Col>
                                <Form.Group controlId="startDate">
                                    <Form.Label className="d-flex justify-content-center">
                                        Start date
                                    </Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Format yyyy-mm-dd" 
                                        onChange={e => setEvent(prev => ({
                                            ...prev, startDate : e.target.value
                                        }))}
                                        value={event.startDate}/>
                                </Form.Group> 
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup className="hasEndDate">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has end date?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={event.hasEndDate} 
                                            onChange={e => setEvent(prev => ({
                                                ...prev, hasEndDate : e.target.checked     
                                            }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            {event.hasEndDate &&
                                <Col>
                                    <FormGroup className="endDate">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>End date</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter date in format yyyy-mm-dd" 
                                                onChange={e => setEvent(prev => ({
                                                    ...prev, endDate : e.target.value
                                                }))}
                                                value={event.endDate}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
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
                                            value={event.hasTime} 
                                            onChange={e => setEvent(prev => ({
                                                ...prev, hasTime : e.target.checked, time : ''
                                        }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            {event.hasTime &&
                                <Col>
                                    <FormGroup className="time">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Time</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter time in format hh:mm" 
                                                onChange={e => setEvent(prev => ({
                                                    ...prev, time : e.target.value
                                                }))}
                                                value={event.time}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                        </Row>
                        <FormGroup className="description">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Description</Form.Label>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    placeholder="Enter description" 
                                    onChange={e => setEvent(prev => ({
                                        ...prev, description : e.target.value
                                    }))}
                                    value={event.description}/>
                            </div>
                        </FormGroup>
                        <div className="d-flex justify-content-center"> 
                            <Button className="mt-2" onClick={() => createEvent()}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
                <div>
                    {events.length ? (
                        <Table striped hover>
                            <tbody>
                                <tr>
                                    <th>Event title</th>
                                    <th>Start date</th>
                                    <th>End date</th>
                                    <th>Time</th>
                                    <th>Contact</th>
                                    <th>Update/Delete</th>
                                </tr>
                                {events.map(eventData => (
                                    <tr key={eventData.id}>
                                        <td>{eventData.title}</td>
                                        <td>{eventData.startDate}</td>
                                        <td>{eventData.hasEndDate ? eventData.endDate : "N/A"}</td>
                                        <td>{eventData.hasTime ? eventData.time : "N/A"}</td>
                                        <td>{eventData.contact.username}</td>
                                        <td className="d-flex justify-content-start">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pen mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => handleOpenModal(eventData)}
                                                >
                                                    <path
                                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-trash mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => deleteEvent(eventData)}
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
                                There are no countries
                            </Alert>
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default Event
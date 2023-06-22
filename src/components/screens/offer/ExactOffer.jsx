import { useContext, useEffect, useState } from "react";
import { OfferService } from "../../../services/offer.service";
import NavigationBar from "../../ui/NavigationBar";
import { Container, Alert, Col, Row, Image, FormGroup, Button, Form, Table} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { UnitedPartsService } from "../../../services/united.parts.service";
import { AuthContext } from "../../../providers/AuthProvider";
import { UnitsService } from "../../../services/unit.service";
import { UnitTypeService } from "../../../services/unit.type.service";

function ExactOffer() {
    const {user} = useContext(AuthContext)
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
    const [unitedPart, setUnitedPart] = useState('')
    const [unitedParts, setUnitedParts] = useState([])
    const [unitType, setUnitType] = useState('')
    const [unitTypes, setUnitTypes] = useState([])
    const [unit, setUnit] = useState('')
    const [units, setUnits] = useState([])

    useEffect(() => {
        const fetchOffer = async () => {
            await OfferService.getById(id, user.token)
                .then(function(response) {
                    setOffer(response.data)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchUnitedParts = async () => {
            await UnitedPartsService.getAll(user.token, id)
                .then(function(response) {
                    setUnitedParts(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchUnits = async () => {
            await UnitsService.getAll(user.token, id)
                .then(function(response) {
                    setUnits(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchUnitTypes = async () => {
            await UnitTypeService.getAll(user.token, id)
                .then(function(response) {
                    setUnitTypes(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        
        fetchOffer()
        fetchUnitedParts()
        fetchUnits()
        fetchUnitTypes()
    }, [])

        
    const getEstablishmentAddress = (est) => {
        const country = est.hasCountry ? (est.country.name + ' ') : ''
        const city = country + (est.hasCity ? (est.city.name + ' ') : '')
        const street = city + (est.hasStreet ? (est.street + ' ') : '')
        const building = street + (est.hasBuilding ? (est.building + ' ') : '')
        const apartment = building + (est.hasApartment ? est.apartment : '')
        return apartment === '' ? ('None') : apartment
    }

    const createUnitedPart = async (e) => {
        e.preventDefault()
        setError('')
        await UnitedPartsService.create(unitedPart, user.token, id)
            .then(function(response) {
                setUnitedParts([
                    ...unitedParts, response.data
                ])
                setUnitedPart('')
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const createUnitType = async (e) => {
        e.preventDefault()
        setError('')
        await UnitTypeService.create(unitType, user.token, id)
            .then(function(response) {
                setUnitTypes([
                    ...unitTypes, response.data
                ])
                setUnitType('')
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const deleteUnitedPart = async (e) => {
        setError('')
        await UnitedPartsService.delete(id, user.token, e.id)
            .then(function(response) {
                setUnitedParts(
                    unitedParts.filter(up => up.id !== e.id)
                )
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const deleteUnitType = async (e) => {
        setError('')
        await UnitTypeService.delete(id, user.token, e.id)
            .then(function(response) {
                setUnitTypes(
                    unitTypes.filter(ut => ut.id !== e.id)
                )
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const changeUnitedPart = (e) => {
        const partName = e.target.value
        if (unitedParts.length > 0) {
            const resultPart = unitedParts.find(up => up.name === partName)
            setUnit(prev => ({
                ...prev, reservationUnitedPart : resultPart, reservationUnitedPartId : resultPart.id
            }))
        }
    }
    
    const changeUnitType = (e) => {
        const typeName = e.target.value
        if (unitTypes.length > 0) {
            const resultType = unitTypes.find(ut => ut.name === typeName)
            setUnit(prev => ({
                ...prev, reservationUnitType : resultType, reservationUnitTypeId : resultType.id
            }))
        }
    }

    const changeHasUnitedPart = (e) => {
        if (unitedParts.length) {
            setUnit(prev => ({
                ...prev, hasUnitedPart : e.target.checked     
            }))
            if (e.target.checked && !unit.unitedPart) {
                setUnit(prev => ({
                    ...prev, reservationUnitedPart : unitedParts[0], reservationUnitedPartId : unitedParts[0].id
                }))
            }
        } else {
            setUnit(prev => ({
                ...prev, hasUnitedPart : false, reservationUnitedPart : {
                    name : '',
                    id : ''
                }     
            }))
        }
    }

    const changeHasReservationType = (e) => {
        if (unitTypes.length) {
            setUnit(prev => ({
                ...prev, hasReservationUnitType : e.target.checked     
            }))
            if (e.target.checked && !unit.unitType) {
                setUnit(prev => ({
                    ...prev, reservationUnitType : unitTypes[0], reservationUnitTypeId : unitTypes[0].id
                }))
            }
        } else {
            setUnit(prev => ({
                ...prev, hasReservationUnitType : false, reservationUnitType : {
                    name : '',
                    id : ''
                }     
            }))
        }
    }

    const createUnit = async (e) => {
        e.preventDefault()
        setError('')
        if (!unit.hasTime) {
            setUnit(prev => ({
                ...prev, time : ''
            }))
        }
        await UnitsService.create(unit, user.token, id)
            .then(function(response) {
                setUnits([
                    ...units, response.data
                ])
                setUnit('')
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const deleteUnit = async (e) => {
        setError('')
        await UnitsService.delete(id, user.token, e.id)
            .then(function(response) {
                setUnits(
                    units.filter(u => u.id !== e.id)
                )
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                {error && <Alert variant='danger' className="mt-2">
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
                <div className="border border-dark px-3 py-2 mt-3">   
                    <h5>Unit types</h5>
                    <Form>
                        <Row>
                            <Col xs={10}>
                                <FormGroup>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter unit type name" 
                                        value={unitType.name} 
                                        onChange={e => setUnitType({
                                            offerId : id, name : e.target.value
                                        })}/>
                                </FormGroup>
                            </Col>
                            <Col>      
                                <Button onClick={e => createUnitType(e)}>
                                    Create
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="mt-2">
                        {unitTypes.length ? (
                            <Table striped hover>
                                <tbody>
                                    <tr>
                                        <th>Unit type name</th>
                                        <th>Delete</th>
                                    </tr>
                                    {unitTypes.map(ut => (
                                        <tr key={ut.id}>
                                            <td>{ut.name}</td>
                                            <td className="d-flex justify-content-start">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-trash mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => deleteUnitType(ut)}
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
                                <Alert variant='light' className="mt-2">
                                    There are no unit types
                                </Alert>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border border-dark px-3 py-2 mt-3">   
                    <h5>United parts</h5>
                    <Form>
                        <Row>
                            <Col xs={10}>
                                <FormGroup>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter united part name" 
                                        value={unitedPart.name} 
                                        onChange={e => setUnitedPart({
                                            offerId : id, name : e.target.value
                                        })}/>
                                </FormGroup>
                            </Col>
                            <Col>      
                                <Button onClick={e => createUnitedPart(e)}>
                                    Create
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <div className="mt-2">
                        {unitedParts.length ? (
                            <Table striped hover>
                                <tbody>
                                    <tr>
                                        <th>United part name</th>
                                        <th>Delete</th>
                                    </tr>
                                    {unitedParts.map(up => (
                                        <tr key={up.id}>
                                            <td>{up.name}</td>
                                            <td className="d-flex justify-content-start">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-trash mx-2"
                                                            viewBox="0 0 16 16"
                                                            onClick={() => deleteUnitedPart(up)}
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
                                <Alert variant='light' className="mt-2">
                                    There are no united parts
                                </Alert>
                            </div>
                        )}
                    </div>
                </div>
                <div className="border border-dark px-3 py-2 mt-3">   
                    <h5>Reservation units</h5>
                    <Form>
                        <FormGroup>
                            <Row>
                                <Col xs={2}>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Name</Form.Label>
                                    </div>
                                </Col>
                                <Col xs={10}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter unit name"
                                        value={unit.name}
                                        onChange={e => setUnit(prev => ({
                                            ...prev, name : e.target.value, offerId : id
                                        }))}/>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Description</Form.Label>
                            </div>
                            <Form.Control
                                as="textarea"
                                placeholder="Leave a comment here"
                                style={{ height: '100px' }}
                                value={unit.description}
                                onChange={e => setUnit(prev => ({
                                    ...prev, description : e.target.value
                                }))}
                            />
                        </FormGroup>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has united part?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={unit.hasUnitedPart} 
                                            onChange={e => changeHasUnitedPart(e)}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                { unit.hasUnitedPart && 
                                    <FormGroup>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>United part</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                                onChange={e => changeUnitedPart(e)}
                                                value={unit.reservationUnitedPart.name}>
                                                {unitedParts.map(up => (
                                                    <option key={up.id}>{up.name}</option>
                                                ))}
                                           </Form.Select>
                                        </div>
                                    </FormGroup>
                                }
                            </Col>
                            <Col>
                                <FormGroup>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has time?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={unit.hasTime} 
                                            onChange={e => setUnit(prev => ({
                                                ...prev, hasTime : e.target.checked
                                        }))}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                { unit.hasTime && 
                                    <FormGroup className="time">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Time</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter time in format hh:mm" 
                                                onChange={e => setUnit(prev => ({
                                                    ...prev, time : e.target.value
                                                }))}
                                                value={unit.time}/>
                                        </div>
                                    </FormGroup>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has order number?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={unit.hasOrderNumber} 
                                            onChange={e => setUnit(prev => ({
                                                ...prev, hasOrderNumber : e.target.checked
                                        }))}/>
                                    </div>
                                </FormGroup>
                            
                            </Col>
                            {unit.hasOrderNumber &&
                                <Col>
                                    <FormGroup className="event">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Order number</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Enter order number" 
                                                onChange={e => setUnit(prev => ({
                                                    ...prev, orderNumber : e.target.value
                                                }))}
                                                value={unit.orderNumber}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                            }
                            <Col>
                                <FormGroup>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Label>Has unit type?</Form.Label>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Form.Check 
                                            type="switch" 
                                            value={unit.hasReservationUnitType} 
                                            onChange={e => changeHasReservationType(e)}/>
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col>
                                { unit.hasReservationUnitType && 
                                    <FormGroup>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Unit type</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                                onChange={e => changeUnitType(e)}
                                                value={unit.reservationUnitType.name}>
                                                {unitTypes.map(ut => (
                                                    <option key={ut.id}>{ut.name}</option>
                                                ))}
                                           </Form.Select>
                                        </div>
                                    </FormGroup>
                                }
                            </Col>
                        </Row>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                            <Button onClick={e => createUnit(e)}>
                                Create
                            </Button>
                        </div>
                    </Form>
                    <div className="mt-2">
                        {units.length ? (
                            <Table striped hover>
                                <tbody>
                                    <tr>
                                        <th>Unit name</th>
                                        <th>United part</th>
                                        <th>Time</th>
                                        <th>Order number</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                    {units.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{u.hasUnitedPart ? u.reservationUnitedPart.name : "N/A"}</td>
                                            <td>{u.hasTime ? u.time : "N/A"}</td>
                                            <td>{u.hasOrderNumber ? u.orderNumber : "N/A"}</td>
                                            <td>{u.hasReservationUnitType ? u.reservationUnitType.name : "N/A"}</td>
                                            <td className="d-flex justify-content-start">
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="currentColor"
                                                            className="bi bi-trash mx-2"
                                                            viewBox="0 0 16 16"
                                                            onClick={() => deleteUnit(u)}
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
                                    There are no units
                                </Alert>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </>
    )
}

export default ExactOffer;
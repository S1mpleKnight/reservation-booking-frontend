import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { EstablishmentService } from "../../../services/establishment.service";
import NavigationBar from "../../ui/NavigationBar";
import { Form, Col, Container, FormGroup, Row, Alert, Button, Table, Modal} from "react-bootstrap";
import { CountryService } from "../../../services/country.service";
import { CityService } from "../../../services/city.service";
import { UserService } from "../../../services/user.service";

function Establishment() {
    const [error, setError] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [establishments, setEstablishments] = useState([])
    const [countries, setCountries] = useState([])
    const [cities, setCities] = useState([])
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [establishment, setEstablishment] = useState({
        hasCountry : false,
        hasCity : false,
        hasBuilding : false,
        hasApartment : false,
        hasStreet : false,
        country : {
            name : ''
        },
        city : {
            name : ''
        },
        contact : {
            username : ''
        },
        contactId : '',
        countryId : '',
        cityId : ''
    })
    const {user} = useContext(AuthContext)

    useEffect(() => {
        setError('')
        const fetchEstablishmentData = async () => {
            await EstablishmentService.getAll(user.token)
                .then(function(response) {
                    setEstablishments(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchCountryData = async () => {
            await CountryService.getAll(user.token)
                .then(function(response) {
                    setCountries(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchCityData = async () => {
            await CityService.getAll(user.token)
                .then(function(response) {
                    setCities(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }
        const fetchUserData = async () => {
            await UserService.getAll(user.token)
                .then(function(response) {
                    setUsers(response.data.content)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }

        fetchEstablishmentData()
        fetchCountryData()
        fetchCityData()
        fetchUserData()
    }, [])

    const changeCounty = (e) => {
        const countryName = e.target.value
        if (countries.length > 0) {
            const resultCountry = countries.find(c => c.name === countryName)
            setEstablishment(prev => ({
                ...prev, country : resultCountry, countryId : resultCountry.id
            }))
        }
    }

    const changeCity = (e) => {
        const cityName = e.target.value
        if (cities.length > 0) {
            const resultCity = cities.find(c => c.name === cityName)
            setEstablishment(prev => ({
                ...prev, city : resultCity, cityId : resultCity.id
            }))
        }
    }

    const changeContact = (e) => {
        const contactName = e.target.value
        if (users.length > 0) {
            const resultContact = users.find(u => u.username === contactName)
            setEstablishment(prev => ({
                ...prev, contact : resultContact, contactId : resultContact.id
            }))
        }
    }

    const createEstablishment = async (e) => {
        e.preventDefault()
        setError('')
        await EstablishmentService.create(establishment, user.token)
            .then(function(response) {
                setEstablishments([
                    ...establishments, response.data
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })   
    }

    const deleteEstablishment = async (establishmentData) => {
        setError('')
        await EstablishmentService.delete(establishmentData.id, user.token)
            .then(function() {
                setEstablishments(
                    establishments.filter(e => e.id !== establishmentData.id)
                )
            })
            .catch(function (errorMessage) {
                setError(errorMessage)
            })  
    }

    const updateEstablishment = async () => {
        setError('')
        await EstablishmentService.update(establishment.id, establishment, user.token)
            .then(function(response) {
                setEstablishments([
                    ...establishments.filter(e => e.id !== response.data.id), response.data
                ])
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                setUpdateError(errorMessage)
            }) 
    }

    const handleCloseModal = () => {
        setUpdateError('')
        setShowModal(false)
        setEstablishment({
            hasCountry : false,
            hasCity : false,
            hasBuilding : false,
            hasApartment : false,
            hasStreet : false,
            country : {
                name : ''
            },
            city : {
                name : ''
            },
            contact : {
                username : ''
            },
            contactId : '',
            countryId : '',
            cityId : ''
        })
    }

    const handleOpenModal = (establishmentData) => {
        setError('')
        setShowModal(true)
        setEstablishment(establishmentData)
    }

    return (
        <>
            <NavigationBar/>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update establishment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateError && <Alert variant='danger'>
                        {updateError.response.data.message}
                    </Alert>}
                    <Form>
                        <div>
                            <Row>
                                <Col>
                                    <FormGroup className="userId">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Select Contact</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                            onChange={e => changeContact(e)}
                                            value={establishment.contact.username}>
                                                {users.map(user => (
                                                    <option key={user.id}>{user.username}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasCountry">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has country?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasCountry} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasCountry : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasCountry &&
                                    <Col>
                                        <FormGroup className="countryId">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select Country</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select
                                                onChange={e => changeCounty(e)}
                                                value={establishment.country.name}>
                                                    {countries.map(country => (
                                                        <option key={country.id}>{country.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasCity">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has city?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasCity} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasCity : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasCity &&
                                    <Col>
                                        <FormGroup className="cityId">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select city</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select
                                                onChange={e => changeCity(e)}
                                                value={establishment.city.name}>
                                                    {cities.map(city => (
                                                        <option key={city.id}>{city.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasStreet">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has street?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasStreet} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasStreet : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasStreet &&
                                    <Col>
                                        <FormGroup className="street">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Street</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter street name"
                                                    value={establishment.street}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, street : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasBuilding">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has building?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasBuilding} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasBuilding : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasBuilding &&
                                    <Col>
                                        <FormGroup className="building">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Building</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter building name"
                                                    value={establishment.building}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, building : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasApartment">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has apartment?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasApartment} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasApartment : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasApartment &&
                                    <Col>
                                        <FormGroup className="apartment">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Apartment</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter apartment name"
                                                    value={establishment.apartment}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, apartment : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                        </div>
                        <div className="d-flex justify-content-center">
                            {countries.length > 0 && cities.length > 0 && ( 
                                <Button className="mt-2" onClick={e => updateEstablishment()}>
                                    Update
                                </Button>
                            )}
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
                        <div>
                            <Row>
                                <Col>
                                    <FormGroup className="userId">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Select Contact</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Select
                                            onChange={e => changeContact(e)}
                                            value={establishment.contact.username}>
                                                {users.map(user => (
                                                    <option key={user.id}>{user.username}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasCountry">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has country?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasCountry} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasCountry : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasCountry &&
                                    <Col>
                                        <FormGroup className="countryId">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select Country</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select
                                                onChange={e => changeCounty(e)}
                                                value={establishment.country.name}>
                                                    {countries.map(country => (
                                                        <option key={country.id}>{country.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasCity">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has city?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasCity} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasCity : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasCity &&
                                    <Col>
                                        <FormGroup className="cityId">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Select city</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Select
                                                onChange={e => changeCity(e)}
                                                value={establishment.city.name}>
                                                    {cities.map(city => (
                                                        <option key={city.id}>{city.name}</option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasStreet">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has street?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasStreet} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasStreet : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasStreet &&
                                    <Col>
                                        <FormGroup className="street">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Street</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter street name"
                                                    value={establishment.street}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, street : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasBuilding">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has building?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasBuilding} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasBuilding : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasBuilding &&
                                    <Col>
                                        <FormGroup className="building">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Building</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter building name"
                                                    value={establishment.building}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, building : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup className="hasApartment">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Label>Has apartment?</Form.Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Form.Check 
                                                type="switch" 
                                                value={establishment.hasApartment} 
                                                onChange={e => setEstablishment(prev => ({
                                                    ...prev, hasApartment : e.target.checked
                                            }))}/>
                                        </div>
                                    </FormGroup>
                                </Col>
                                {establishment.hasApartment &&
                                    <Col>
                                        <FormGroup className="apartment">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Label>Apartment</Form.Label>
                                            </div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Form.Control 
                                                    type="text" 
                                                    placeholder="Enter apartment name"
                                                    value={establishment.apartment}
                                                    onChange={e => setEstablishment(prev => ({
                                                        ...prev, apartment : e.target.value
                                                }))}/>
                                            </div>
                                        </FormGroup>
                                    </Col>
                                }
                            </Row>
                        </div>
                        <div className="d-flex justify-content-center">
                            {countries.length > 0 && cities.length > 0 && ( 
                                <Button className="mt-2" onClick={e => createEstablishment(e)}>
                                    Create
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
                <div>
                    {establishments.length ? (
                        <Table striped hover>
                            <tbody>
                                <tr>
                                    <th>Country name</th>
                                    <th>City name</th>
                                    <th>Street name</th>
                                    <th>Building</th>
                                    <th>Apartment</th>
                                    <th>Update/Delete</th>
                                </tr>
                                {establishments.map(establishmentData => (
                                    <tr key={establishmentData.id}>
                                        <td>{establishmentData.hasCountry ? establishmentData.country.name : 'N/A'}</td>
                                        <td>{establishmentData.hasCity ? establishmentData.city.name : 'N/A'}</td>
                                        <td>{establishmentData.hasStreet ? establishmentData.street : 'N/A'}</td>
                                        <td>{establishmentData.hasBuilding ? establishmentData.building : 'N/A'}</td>
                                        <td>{establishmentData.hasApartment ? establishmentData.apartment : 'N/A'}</td>
                                        <td className="d-flex justify-content-start">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pen mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => handleOpenModal(establishmentData)}
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
                                                        onClick={() => deleteEstablishment(establishmentData)}
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
                                There are no establishments
                            </Alert>
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default Establishment
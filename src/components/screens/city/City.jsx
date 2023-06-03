import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import { CityService } from "../../../services/city.service" 
import NavigationBar from "../../ui/NavigationBar"
import { Button, Container, FormGroup, Alert, Form, Table, Modal } from "react-bootstrap"
import { CountryService } from "../../../services/country.service"

function City() {
    const [cities, setCities] = useState([])
    const [error, setError] = useState('')
    const {user} = useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)
    const [city, setCity] = useState({country : '', name: '', countryId : '', id : ''})
    const [countries, setCountries] = useState([])

    useEffect(() => {
        setError('')
        const fetchCityData = async () => {
            await CityService.getAll(user.token)
                .then(function(response) {
                    setCities(response.data.content)
                })
                .catch(function (errorMessage) {
                    setError(errorMessage)
                })        
        }
        const fetchCountryData = async () => {
            await CountryService.getAll(user.token)
                .then(function(response) {
                    const responseData = response.data.content
                    setCountries(responseData)
                    if (responseData.length > 0) {
                        setCity(prev => ({
                            ...prev, country : responseData[0], countryId : responseData[0].id
                        }))
                    }
                })
                .catch(function (errorMessage) {
                    setError(errorMessage)
                })              
        }

        fetchCityData()
        fetchCountryData()
    }, [])

    const handleOpenModal = (cityData) => {
        setShowModal(true)
        setCity(cityData)
        setCity(prev => ({
            ...prev, countryId : prev.country.id
        }))
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setCity({country : '', name: '', countryId : '', id : ''})
        if (countries.length > 0) {
            setCity(prev => ({
                ...prev, country : countries[0], countryId : countries[0].id
            }))
        }
    }

    const deleteCity = async (cityData) => {
        setError('')
        await CityService.delete(cityData.id, user.token)
            .then(function() {
                setCities(
                    cities.filter(cityEntity => cityEntity.id !== cityData.id)
                )
            })
            .catch(function (errorMessage) {
                setError(errorMessage)
            })  
    }

    const createCity = async (e) => {
        e.preventDefault()
        setError('')
        await CityService.create(city, user.token)
            .then(function(response) {
                setCities([
                    ...cities, response.data
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })    
    }

    const changeCounty = (e) => {
        const countryName = e.target.value
        if (countries.length > 0) {
            const resultCountry = countries.find(c => c.name === countryName)
            setCity(prev => ({
                ...prev, country : resultCountry, countryId : resultCountry.id
            }))
        }
    }

    const updateCity = async (e) => {
        e.preventDefault()
        handleCloseModal()
        setError('')
        await CityService.update(city.id, city, user.token)
            .then(function(response) {
                setCities([
                    ...cities.filter(country => country.id !== response.data.id), response.data
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            }) 
    }

    return (
        <>
            <NavigationBar/>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update city</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup controlId="name">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>City name</Form.Label>
                            </div>
                            <Form.Control type="text" placeholder="Enter city name"
                                onChange={e => setCity(prev => ({
                                    ...prev, name : e.target.value
                                }))}
                                value={city.name}
                            />
                        </FormGroup>
                        <FormGroup controlId="countryId">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Country</Form.Label>
                            </div>
                            <Form.Select
                                onChange={e => changeCounty(e)}
                                value={city.country.name}>
                                {countries.map(country => (
                                    <option key={country.id}>{country.name}</option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                        <div className="d-flex justify-content-center">
                            <Button disabled={countries.length < 0} className="mt-2" onClick={e => updateCity(e)}>
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
                        <FormGroup controlId="name">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>City name</Form.Label>
                            </div>
                            <Form.Control type="text" placeholder="Enter city name"
                                onChange={e => setCity(prev => ({
                                    ...prev, name : e.target.value
                                }))}
                                value={city.name}
                            />
                        </FormGroup>
                        <FormGroup controlId="countryId">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Country</Form.Label>
                            </div>
                            <Form.Select
                                onChange={e => changeCounty(e)}
                                value={city.country.name}>
                                {countries.map(country => (
                                    <option key={country.id}>{country.name}</option>
                                ))}
                            </Form.Select>
                        </FormGroup>
                        <div className="d-flex justify-content-center">
                            {countries.length > 0 && ( 
                                <Button className="mt-2" onClick={e => createCity(e)}>
                                    Create
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
                <div>
                    {cities.length ? (
                        <Table striped hover>
                            <tbody>
                                <tr>
                                    <th>City name</th>
                                    <th>Country name</th>
                                    <th>Update/Delete</th>
                                </tr>
                                {cities.map(cityData => (
                                    <tr key={cityData.id}>
                                        <td>{cityData.name}</td>
                                        <td>{cityData.country.name}</td>
                                        <td className="d-flex justify-content-start">
                                            <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pen mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => handleOpenModal(cityData)}
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
                                                        onClick={() => deleteCity(cityData)}
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

export default City
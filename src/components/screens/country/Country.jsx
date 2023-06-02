import { useEffect, useState, useContext } from "react";
import { CountryService } from "../../../services/country.service";
import NavigationBar from "../../ui/NavigationBar";
import { AuthContext } from "../../../providers/AuthProvider";
import { Button, Container, Form, FormGroup, Alert, Table, Modal} from "react-bootstrap";

function Country() {
    const [countries, setCountries] = useState([])
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const {user} = useContext(AuthContext)
    const [showModal, setShowModal] = useState(false)
    const [countryId, setCountryId] = useState('')

    useEffect(() => {
        setError('')
        const fetchData = async () => {
            await CountryService.getAll(user.token)
                .then(function (response) {
                    const answer = response.data.content
                    setCountries(answer)
                })
                .catch(function (errorMessage) {
                    setError(errorMessage)
                })    
        }
    
        fetchData()
    }, [])

    const createCountry = async (e) => {
        e.preventDefault()
        setError('')
        await CountryService.create({name}, user.token)
            .then(function(response) {
                const oldCountries = countries
                oldCountries.push(response.data)
                setCountries([
                    ...oldCountries,
                    {id: response.data.id, name: response.data.name}
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const deleteCountry = async (countryData) => {
        setError('')
        await CountryService.delete(countryData.id, user.token)
            .then(function(response) {
                setCountries(
                    countries.filter(country => country.id !== countryData.id)
                )
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    const updateCountry = async () => {
        setError('')
        await CountryService.update(countryId, {name}, user.token)
            .then(function(response) {
                setCountries([
                    ...countries.filter(country => country.id !== countryId),
                    {id: response.data.id, name: response.data.name}
                ])
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                handleCloseModal()
                setError(errorMessage)
            })
    }

    const handleCloseModal = () => {
        setName('')
        setShowModal(false)
        setCountryId('')
    }

    const handleOpenModal = (country) => {
        setName(country.name)
        setCountryId(country.id)
        setShowModal(true)
    }

    return (
        <>
            <NavigationBar/>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update country</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup controlId="name">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Country name</Form.Label>
                            </div>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter country name" 
                                value={name} 
                                onChange={e => setName(e.target.value)}/>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => updateCountry()} className="mt-3">
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container>
                <div className="d-flex justify-content-center my-3">
                    <Form>
                        {error && <Alert variant='danger'>
                            {error.response.data.message}
                        </Alert>}
                        <div>
                            <FormGroup controlId="name">
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label>Country name</Form.Label>
                                </div>
                                <Form.Control type="text" placeholder="Enter country name" 
                                value={name} onChange={e => setName(e.target.value)}/>
                            </FormGroup>
                            <div className="d-flex justify-content-center">
                                <Button onClick={e => createCountry(e)} className="mt-3">
                                    Create
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
                <div>
                        {countries.length ? (
                            <Table striped hover>
                                <tbody>

                                    {countries.map(country => (
                                        <tr key={country.id}>
                                            <td>{country.name}</td>
                                            <td className="d-flex justify-content-end">
                                            <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="16"
                                                         height="16"
                                                         fill="currentColor"
                                                         className="bi bi-pen mx-2"
                                                         viewBox="0 0 16 16"
                                                         onClick={() => handleOpenModal(country)}
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
                                                         onClick={() => deleteCountry(country)}
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

export default Country
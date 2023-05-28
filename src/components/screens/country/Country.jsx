import { useEffect, useState, useContext } from "react";
import { CountryService } from "../../../services/country.service";
import NavigationBar from "../../ui/NavigationBar";
import { AuthContext } from "../../../providers/AuthProvider";
import { Button, Card, Container, Form, FormGroup, Alert} from "react-bootstrap";

function Country() {
    const [countries, setCountries] = useState([])
    const [error, setError] = useState('')
    const [name, setName] = useState('')
    const {user} = useContext(AuthContext)

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

    const createCountry = (e) => {
        e.preventDefault()
        setError('')
        CountryService.create({name}, user.token)
            .then(function(response) {
                const oldCountries = countries
                oldCountries.push(response.data)
                setCountries(oldCountries)
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            })
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                <div className="d-flex justify-content-center mt-3">
                    <Form>
                        {error && <Alert variant='danger'>
                            {console.log(error)}
                            {error}
                        </Alert>}
                        <div className="d-flex ">
                            <FormGroup controlId="name">
                                <Form.Label>Country name</Form.Label>
                                <Form.Control type="text" placeholder="Enter country name" 
                                value={name} onChange={e => setName(e.target.value)}/>
                            </FormGroup>
                            <Button onClick={e => createCountry(e)}>
                                Create
                            </Button>
                        </div>
                    </Form>
                </div>
                <div>
                        {countries.length ? (
                            countries.map(country => (
                                <Card key={country.id}>
                                    <Card.Body>{country.name}</Card.Body>
                                </Card>
                            )) 
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
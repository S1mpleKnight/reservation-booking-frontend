import NavigationBar from "../../ui/NavigationBar";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth.service";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";

function Login() {
    const {setUser} = useContext(AuthContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const history = useNavigate();

    const authenticate = (e) => {
        e.preventDefault()
        setError('')
        AuthService.authenticate({username, password})
        .then(function (response) {
            setUser(response.data)
            history('/home')
        })
        .catch(function (errorMessage) {
            setError(errorMessage)
        })
    }

    return (
        <>
            <NavigationBar/>
            <Container>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '92vh' }}>
                    <Form>
                        {error && <Alert variant='danger'>
                            {error.response.data.message}
                        </Alert>}
                        <Form.Group className="mb-3" controlId="nickname">
                            <Form.Label className="d-flex justify-content-center">Nickname</Form.Label>
                            <Form.Control type="text" placeholder="Enter nickname" 
                            onChange={e => setUsername(e.target.value)} value={username}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="d-flex justify-content-center">Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" 
                            onChange={e => setPassword(e.target.value)} value={password}/>
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button className="mx-1" onClick={e => authenticate(e)}>
                                Login
                            </Button>
                            <Button as={Link} to="/registration" className="mx-1">
                                Registration
                            </Button>
                        </div>
                    </Form>     
                </div>
    
            </Container>
        </>
    )
}

export default Login
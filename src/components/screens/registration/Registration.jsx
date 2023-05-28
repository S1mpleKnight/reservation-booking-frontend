import { Button, Col, Container, Form, Row, Alert} from "react-bootstrap";
import NavigationBar from "../../ui/NavigationBar";
import { useState } from "react";
import { AuthService } from "../../../services/auth.service";

function Registration() {

    const [data, setData] = useState({
        firstname : '',
        lastname : '',
        username : '',
        password : '',
        email : '',
        birthday : '',
        isMale : false,
        roleName : 'USER'
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const processData = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        AuthService.register(data)
        .then(function (successData) {
            setSuccess(successData)
            setData({
                firstname : '',
                lastname : '',
                username : '',
                password : '',
                email : '',
                birthday : '',
                isMale : false,
                roleName : 'USER'
            })
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
                    {success && <Alert variant='info'>
                        Successfully registered!
                    </Alert>}
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="firstname">
                                <Form.Label className="d-flex justify-content-center">First name</Form.Label>
                                <Form.Control type="text" placeholder="Enter first name"
                                onChange={e => setData(prev => ({
                                    ...prev, firstname : e.target.value
                                }))}
                                value={data.firstname} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="lastname">
                                <Form.Label className="d-flex justify-content-center">Last name</Form.Label>
                                <Form.Control type="text" placeholder="Enter last name" 
                                onChange={e => setData(prev => ({
                                    ...prev, lastname : e.target.value
                                }))}
                                value={data.lastname}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="nickname">
                                <Form.Label className="d-flex justify-content-center">Nickname</Form.Label>
                                <Form.Control type="text" placeholder="Enter nickname" 
                                onChange={e => setData(prev => ({
                                    ...prev, username : e.target.value
                                }))}
                                value={data.username}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="d-flex justify-content-center">Password</Form.Label>
                                <Form.Control type="password" placeholder="Password"
                                onChange={e => setData(prev => ({
                                    ...prev, password : e.target.value
                                }))}
                                value={data.password} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="d-flex justify-content-center">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" 
                                onChange={e => setData(prev => ({
                                    ...prev, email : e.target.value
                                }))}
                                value={data.email}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="birthday">
                        <Form.Label className="d-flex justify-content-center">Birthday</Form.Label>
                        <Form.Control type="text" placeholder="Enter date in format yyyy-mm-dd" 
                                onChange={e => setData(prev => ({
                                    ...prev, birthday : e.target.value
                                }))}
                                value={data.birthday}/>
                    </Form.Group> 

                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Form.Group controlId="isMale">
                                <Form.Label className="d-flex justify-content-center">Is male? </Form.Label>
                                <Form.Check className="mx-2" type="switch"
                                onChange={e => setData(prev => ({
                                    ...prev, isMale : e.target.value
                                }))}
                                value={data.isMale}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="roleName">
                                <Form.Label className="d-flex justify-content-center">Role</Form.Label>
                                <Form.Select
                                onChange={e => setData(prev => ({
                                    ...prev, roleName : e.target.value
                                }))}
                                value={data.roleName}>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                    <option value="SUPPLIER">Supplier</option>
                                    <option value="RESPONSIBLE">Responsible person</option>
                                </Form.Select>
                            </Form.Group> 
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-center">
                        <Button onClick={e => processData(e)} >
                            Register
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
        </>
    )
}

export default Registration
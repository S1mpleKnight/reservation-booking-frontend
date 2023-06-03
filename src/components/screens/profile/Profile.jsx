import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import { AuthService } from "../../../services/auth.service"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Alert, Row, Col, FormControl, Form, Button, Modal } from "react-bootstrap"

function Profile() {
    const {user} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [userData, setUserData] = useState('')
    const [updateUser, setUpdateUser] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [updateError, setUpdateError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            await AuthService.getProfile(user.token)
                .then(function(response) {
                    setUserData(response.data)
                })
                .catch(function(errorMessage) {
                    setError(errorMessage)
                })
        }

        fetchData()
    }, [])

    const handleOpenModal = (e) => {
        e.preventDefault()
        setError('')
        setShowModal(true)
        setUpdateUser(userData)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setUpdateError('')
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        setUpdateError('')
        await AuthService.updateProfile(updateUser, user.token)
            .then(function(response) {
                setUserData(response.data)
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                setUpdateError(errorMessage)
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
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {updateError && <Alert variant='danger'>
                                {updateError.response.data.message}
                            </Alert>}
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="firstname">
                                        <Form.Label className="d-flex justify-content-center">First name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter first name"
                                        onChange={e => setUpdateUser(prev => ({
                                            ...prev, firstname : e.target.value
                                        }))}
                                        value={updateUser.firstname} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="lastname">
                                        <Form.Label className="d-flex justify-content-center">Last name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter last name" 
                                        onChange={e => setUpdateUser(prev => ({
                                            ...prev, lastname : e.target.value
                                        }))}
                                        value={updateUser.lastname}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="nickname">
                                        <Form.Label className="d-flex justify-content-center">Nickname</Form.Label>
                                        <Form.Control type="text" placeholder="Enter nickname" 
                                        onChange={e => setUpdateUser(prev => ({
                                            ...prev, username : e.target.value
                                        }))}
                                        value={updateUser.username}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="birthday">
                                        <Form.Label className="d-flex justify-content-center">Birthday</Form.Label>
                                        <Form.Control type="text" placeholder="Enter date in format yyyy-mm-dd" 
                                                onChange={e => setUpdateUser(prev => ({
                                                    ...prev, birthday : e.target.value
                                                }))}
                                                value={updateUser.birthday}/>
                                    </Form.Group> 
                                </Col>
                            </Row>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="d-flex justify-content-center">Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" 
                                        onChange={e => setUpdateUser(prev => ({
                                            ...prev, email : e.target.value
                                        }))}
                                        value={updateUser.email}/>
                            </Form.Group>
                            
                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <Form.Group controlId="isMale">
                                        <Form.Label className="d-flex justify-content-center">Is male? </Form.Label>
                                        <Form.Check className="mx-2" type="switch"
                                        onChange={e => setUpdateUser(prev => ({
                                            ...prev, isMale : e.target.checked
                                        }))}
                                        value={updateUser.isMale}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => updateProfile(e)} className="mt-3">
                                Update
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="firstname">
                                    <Form.Label className="d-flex justify-content-center">First name</Form.Label>
                                    <Form.Control type="text"value={userData.firstname} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="lastname">
                                    <Form.Label className="d-flex justify-content-center">Last name</Form.Label>
                                    <Form.Control type="text" value={userData.lastname}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="nickname">
                                    <Form.Label className="d-flex justify-content-center">Nickname</Form.Label>
                                    <Form.Control type="text" value={userData.username}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="birthday">
                                    <Form.Label className="d-flex justify-content-center">Birthday</Form.Label>
                                    <Form.Control type="text" value={userData.birthday}/>
                                </Form.Group> 
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label className="d-flex justify-content-center">Email address</Form.Label>
                            <Form.Control type="email" value={userData.email}/>
                        </Form.Group>

                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Form.Group controlId="isMale">
                                    <Form.Label className="d-flex justify-content-center">Is male? </Form.Label>
                                    <FormControl type="text" value={userData.isMale}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="roleName">
                                    <Form.Label className="d-flex justify-content-center">Role</Form.Label>
                                    <FormControl type="text" value={userData.roleName}/>
                                </Form.Group> 
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Button onClick={(e) => handleOpenModal(e)}>
                                    Update
                                </Button>
                            </Col>
                        </Row>
                    </Form>                    
                </div>
            </Container>
        </>
    )
}

export default Profile
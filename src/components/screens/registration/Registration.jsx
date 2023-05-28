import { Button, Col, Container, Form, Row} from "react-bootstrap";
import NavigationBar from "../../ui/NavigationBar";

function Registration() {
    return (
        <>
        <NavigationBar/>
        <Container>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '92vh' }}>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="firstname">
                                <Form.Label className="d-flex justify-content-center">First name</Form.Label>
                                <Form.Control type="text" placeholder="Enter first name" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="lastname">
                                <Form.Label className="d-flex justify-content-center">Last name</Form.Label>
                                <Form.Control type="text" placeholder="Enter last name" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="nickname">
                                <Form.Label className="d-flex justify-content-center">Nickname</Form.Label>
                                <Form.Control type="text" placeholder="Enter nickname" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="d-flex justify-content-center">Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label className="d-flex justify-content-center">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="birthday">
                        <Form.Label className="d-flex justify-content-center">Birthday</Form.Label>
                        <Form.Control type="text" placeholder="Enter date in format yyyy-mm-dd" />
                    </Form.Group> 

                    <Row>
                        <Col className="d-flex justify-content-center">
                            <Form.Group controlId="isMale">
                                <Form.Label className="d-flex justify-content-center">Is male? </Form.Label>
                                <Form.Check className="mx-2" type="switch"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="roleName">
                                <Form.Label className="d-flex justify-content-center">Role</Form.Label>
                                <Form.Select>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                    <option value="SUPPLIER">Supplier</option>
                                    <option value="RESPONSIBLE">Responsible person</option>
                                </Form.Select>
                            </Form.Group> 
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-center">
                        <Button type="submit" >
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
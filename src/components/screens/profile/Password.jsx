import { useContext, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import NavigationBar from "../../ui/NavigationBar"
import { Button, Container, Form, Alert } from "react-bootstrap"
import { AuthService } from "../../../services/auth.service"

function Password() {
    const {user} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [data, setData] = useState({oldPassword: '', newPassword: '', repeatNewPassword: ''})
    const [showMessage, setShowMessage] = useState(false)

    const updatePassword = async (e) => {
        setError('')
        setShowMessage(false)
        e.preventDefault()
        await AuthService.updatePassword(data, user.token)
            .then(function() {
                setShowMessage(true)
                setData({oldPassword: '', newPassword: '', repeatNewPassword: ''})
            })
            .catch(function(errorMessage) {
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
                        {showMessage && <Alert variant='success'>
                            Password updated successfully!
                        </Alert>}
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">Old Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter old password"
                            value={data.oldPassword}
                            onChange={e => setData(prev => ({
                                ...prev, oldPassword : e.target.value
                            }))}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">New password</Form.Label>
                            <Form.Control type="password" placeholder="Enter new password"
                            value={data.newPassword}
                            onChange={e => setData(prev => ({
                                ...prev, newPassword : e.target.value
                            }))}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="d-flex justify-content-center">Repeat new password</Form.Label>
                            <Form.Control type="password" placeholder="Repeat old password"
                            value={data.repeatNewPassword}
                            onChange={e => setData(prev => ({
                                ...prev, repeatNewPassword : e.target.value
                            }))}/>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button className="mt-2" onClick={e => updatePassword(e)}>
                                Change password
                            </Button>
                        </div>
                    </Form> 
                </div>    
            </Container>
        </>
    )
}

export default Password
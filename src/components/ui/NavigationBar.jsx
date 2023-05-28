import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar  from 'react-bootstrap/Navbar';
import { AuthContext } from '../../providers/AuthProvider';

function NavigationBar() {
    const {user} = useContext(AuthContext)

    return (
    <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">BOOKING</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="#home">Offers</Nav.Link>
                    {
                        !!user 
                        ? 
                        <>
                            <Nav.Link href="#features">Reservations</Nav.Link>
                            <Nav.Link href="#pricing">Profile</Nav.Link>
                            <Nav.Link href="#categories">Categories</Nav.Link>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </>
                        :
                        <>
                            <Nav.Link href="/login">Login</Nav.Link>
                        </> 
                    }
                    
                </Nav>
            </Container>
        </Navbar>
    </>
    )
}

export default NavigationBar;
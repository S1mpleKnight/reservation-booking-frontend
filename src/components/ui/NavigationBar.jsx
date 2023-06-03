import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar  from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

function NavigationBar() {
    const {user} = useContext(AuthContext)

    return (
    <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">BOOKING</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="#home">Offers</Nav.Link>
                    {
                        !!user 
                        ? 
                        <>
                            <Nav.Link as={Link} to="#features">Reservations</Nav.Link>
                            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                            <Nav.Link as={Link} to="/countries">Countries</Nav.Link>
                            <Nav.Link as={Link} to="/cities">Cities</Nav.Link>
                            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                        </>
                        :
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </> 
                    }
                    
                </Nav>
            </Container>
        </Navbar>
    </>
    )
}

export default NavigationBar;
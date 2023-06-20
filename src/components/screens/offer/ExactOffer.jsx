import { useEffect, useState } from "react";
import { OfferService } from "../../../services/offer.service";
import NavigationBar from "../../ui/NavigationBar";
import { Container } from "react-bootstrap";

function ExactOffer(props) {
    const [offer, setOffer] = useState('')
    const [error, setError] = useState('')
    const {id} = props.id

    useEffect(() => {
        const fetchOffer = async () => {
            await OfferService.getById(id)
                .then(function(response) {
                    setOffer(response.data)
                })
                .else(function(errorMessage) {
                    setError(errorMessage)
                })
        }

        fetchOffer()
    }, [])

    return (
        <>
            <NavigationBar/>
            <Container>
                {error && <Alert variant='danger'>
                    {error.response.data.message}
                </Alert>}
            </Container>
        </>
    )
}

export default ExactOffer;
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import NavigationBar from "../../ui/NavigationBar"
import { Container, Form, Alert, FormGroup, Button, Table, Modal } from "react-bootstrap"
import { CategoryService } from "../../../services/category.service"

function Category() {
    const {user} = useContext(AuthContext)
    const [error, setError] = useState('')
    const [updateError, setUpdateError] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setError('')
        const fetchCategoryData = async () => {
            await CategoryService.getAll(user.token)
                .then(function(response) {
                    setCategories(response.data.content)
                })
                .catch(function (errorMessage) {
                    setError(errorMessage)
                }) 
        }

        fetchCategoryData()
    }, [])

    const createCategory = async (e) => {
        e.preventDefault()
        setError('')
        await CategoryService.create(category, user.token)
            .then(function(response) {
                setCategories([
                    ...categories, response.data
                ])
            })
            .catch(function(errorMessage) {
                setError(errorMessage)
            }) 
    }

    const deleteCategory = async (category) => {
        setError('')
        await CategoryService.delete(category.id, user.token)
            .then(function() {
                setCategories(
                    categories.filter(categoryEntity => categoryEntity.id !== category.id)
                )
            })
            .catch(function (errorMessage) {
                setError(errorMessage)
            })  
    }

    const updateCategory = async (e) => {
        e.preventDefault()
        setUpdateError('')
        await CategoryService.update(category.id, category, user.token)
            .then(function (response) {
                setCategories([
                    ...categories.filter(categoryData => categoryData.id !== category.id),
                    response.data
                ])
                handleCloseModal()
            })
            .catch(function(errorMessage) {
                setUpdateError(errorMessage)
            })
    }

    const handleCloseModal = () => {
        setUpdateError('')
        setShowModal(false)
        setCategory({name: ''})
    }

    const handleOpenModal = (category) => {
        setError('')
        setShowModal(true)
        setUpdateError('')
        setCategory(category)
    }

    return (
        <>
            <NavigationBar/>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {updateError && <Alert variant='danger'>
                        {updateError.response.data.message}
                    </Alert>}
                    <Form>
                        <FormGroup controlId="name">
                            <div className="d-flex align-items-center justify-content-center">
                                <Form.Label>Category name</Form.Label>
                            </div>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter country name" 
                                value={category.name} 
                                onChange={e => setCategory(prev => ({
                                    ...prev, name : e.target.value
                                }))}/>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={(e) => updateCategory(e)} className="mt-3">
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
                                    <Form.Label>Category name</Form.Label>
                                </div>
                                <Form.Control type="text" placeholder="Enter country name" 
                                value={category.name} onChange={e => setCategory(prev => ({
                                    ...prev, name : e.target.value
                                }))}/>
                            </FormGroup>
                            <div className="d-flex justify-content-center">
                                <Button onClick={e => createCategory(e)} className="mt-3">
                                    Create
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
                <div>
                    {categories.length ? (
                        <Table striped hover>
                            <tbody>
                                <tr>
                                    <th>Category name</th>
                                    <th>Update/Delete</th>
                                </tr>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td className="d-flex justify-content-start">
                                        <div>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-pen mx-2"
                                                        viewBox="0 0 16 16"
                                                        onClick={() => handleOpenModal(category)}
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
                                                        onClick={() => deleteCategory(category)}
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
                                There are no categories
                            </Alert>
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default Category
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import InputGroup from 'react-bootstrap/InputGroup'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
function EditCategory({ show, handleClose, todoID, todoName, todoPath }) {
	const [todo, setTodo] = useState(todoName)
	const [error, setError] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (todo.trim() === '') {
			setError('Please enter a todo and description')
			return
		}
		//update todo to firebase using db.collection('todos')
		//try and catch
		try {
			const todoRef = doc(db, `categories${todoPath}/todos`)
			updateDoc(todoRef, {
				name: todo,
			})
			handleClose()
			toast.success('Todo updated successfully')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Category</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<InputGroup className='mb-3'>
							<Form.Control
								placeholder='Add your todo here'
								aria-label='Add your todo here'
								aria-describedby='basic-addon2'
								value={todo}
								onChange={(e) => setTodo(e.target.value)}
							/>
							<Button
								variant='outline-primary'
								id='button-addon2'
							>
								Button
							</Button>
						</InputGroup>
						{error && (
							<Alert variant='danger'>
								<Alert.Heading>
									Oh snap! You got an error!
								</Alert.Heading>
								{error}
							</Alert>
						)}
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleSubmit}>
						Save Changes
					</Button>
				</Modal.Footer>
				{error && (
					<Alert variant='danger'>
						<Alert.Heading>
							Oh snap! You got an error!
						</Alert.Heading>
						{error}
					</Alert>
				)}
			</Modal>
		</>
	)
}

export default EditCategory

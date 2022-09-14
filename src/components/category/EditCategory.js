import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
function EditCategory({
	show,
	handleClose,
	categoryId,
	categoryName,
	categoryDescription,
}) {
	const [name, setName] = useState(categoryName)
	const [description, setDescription] = useState(categoryDescription)
	const [error, setError] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (name.trim() === '' || description.trim() === '') {
			setError('Please enter a todo and description')
			return
		}
		//update todo to firebase using db.collection('todos')
		//try and catch
		try {
			const docRef = doc(db, 'categories', name)
			const docSnap = await getDoc(docRef)
			console.log(docSnap)

			if (docSnap.exists()) {
				setError('You already have this category. Choose another name')
			} else {
				const categoriesRef = doc(db, 'categories', categoryId)
				updateDoc(categoriesRef, {
					name: name,
					description: description,
				})
				handleClose()
				toast.success('Category updated successfully')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Category</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group
							className='mb-3'
							controlId='exampleForm.ControlInput1'
						>
							<Form.Label>Category Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='category name'
								autoFocus
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>
						<Form.Group
							className='mb-3'
							controlId='exampleForm.ControlTextarea1'
						>
							<Form.Label>Category Description</Form.Label>
							<Form.Control
								as='textarea'
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</Form.Group>
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

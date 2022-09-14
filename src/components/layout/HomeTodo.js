import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import { useState, useEffect } from 'react'
import { db } from '../../firebase'
import colors from './colors'
import Alert from 'react-bootstrap/Alert'
import { toast } from 'react-toastify'
import { collection, Timestamp, doc, getDoc, setDoc } from 'firebase/firestore'
const HomeTodo = () => {
	const [todo, setTodo] = useState('')
	const [description, setDescription] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (todo.trim() === '' || description.trim() === '') {
			setError('Please enter a todo and description')
			return
		}
		//add todo to firebase using db.collection('todos').add() try and catch
		try {
			const categoriesRef = collection(db, 'categories')
			// 	//pick random color from colors array
			const color = colors[Math.floor(Math.random() * colors.length)]
			// 	//check if document exists
			const docRef = doc(db, 'categories', todo)
			const docSnap = await getDoc(docRef)
			// 	console.log(docSnap)

			if (docSnap.exists()) {
				setError('You already have this category added')
			} else {
				await setDoc(doc(categoriesRef, todo.toLowerCase()), {
					name: todo,
					description: description,
					created: Timestamp.now(),
					colorCode: color,
					todoCount: 0,
				})

				toast.success('Category added successfully')
				setTodo('')
				setDescription('')
			}
		} catch (error) {
			console.log(error)
		}
	}

	//useEffect to to set Timeout to clear error message
	useEffect(() => {
		const timeout = setTimeout(() => {
			setError('')
		}, 3000)
		return () => clearTimeout(timeout)
	}, [error])

	return (
		<div className='text-center mb-5'>
			<Row>
				<h1>My Todo</h1>
				<p>You can add your todo by using the form below</p>
			</Row>

			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Form onSubmit={handleSubmit}>
						<Form.Group className='mb-1'>
							<Form.Label>Category Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Category Name'
								aria-label='Add your category here'
								aria-describedby='add-category'
								value={todo}
								onChange={(e) => setTodo(e.target.value)}
							/>
						</Form.Group>
						<Form.Group
							className='mb-2'
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
						<Button variant='primary' type='submit'>
							Submit
						</Button>
					</Form>
					{error && (
						<Alert variant='danger'>
							<Alert.Heading>
								Oh snap! You got an error!
							</Alert.Heading>
							{error}
						</Alert>
					)}
				</Col>
			</Row>
		</div>
	)
}

export default HomeTodo

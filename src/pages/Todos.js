import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Alert from 'react-bootstrap/Alert'
import { db } from '../firebase'
import Todo from '../components/todos/Todo'
import {
	collection,
	Timestamp,
	doc,
	setDoc,
	getDoc,
	query,
	orderBy,
	onSnapshot,
	updateDoc,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const Todos = () => {
	const [todo, setTodo] = useState('')
	const [error, setError] = useState('')
	const location = useLocation()
	const [todos, setTodos] = useState([])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (todo.trim() === '') {
			setError('Please enter a todo')
			return
		}
		try {
			const categoriesRef = collection(
				db,
				`categories${location.pathname}/todos`
			)
			const docRef = doc(categoriesRef, todo)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setError('You already have this todo added')
			} else {
				await setDoc(doc(categoriesRef, todo.toLowerCase()), {
					name: todo,
					completed: false,
					created: Timestamp.now(),
				})
				const docuRef = doc(db, 'categories', location.pathname)
				updateDoc(docuRef, {
					todoCount: todos.length + 1,
				})
				toast.success('Todo added successfully')
				setTodo('')
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

	useEffect(() => {
		const q = query(
			collection(db, `categories${location.pathname}/todos`),
			orderBy('created', 'desc')
		)
		onSnapshot(q, (querySnapshot) => {
			setTodos(
				querySnapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}))
			)
		})
	}, [location.pathname])

	return (
		<Container>
			<Col md={{ span: 6, offset: 3 }}>
				<Form onSubmit={handleSubmit}>
					<InputGroup className='mb-3'>
						<Form.Control
							placeholder='Add your todo here'
							aria-label='Add your todo here'
							aria-describedby='basic-addon2'
							value={todo}
							onChange={(e) => setTodo(e.target.value)}
						/>
						<Button variant='outline-primary' id='button-addon2'>
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

				{todos.map((todo) => (
					<Todo
						key={todo.id}
						id={todo.id}
						todo={todo.data}
						path={location.pathname}
						length={todos.length}
					/>
				))}
			</Col>
		</Container>
	)
}

export default Todos

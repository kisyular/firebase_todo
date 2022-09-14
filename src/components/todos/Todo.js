import React from 'react'
import { Card } from 'react-bootstrap'
import {
	FaRegCircle,
	FaRegCheckCircle,
	FaCheck,
	FaRegTimesCircle,
	FaTrash,
	FaPencilAlt,
} from 'react-icons/fa'
import './Todo.css'
import EditTodo from './EditTodo'
import { useState } from 'react'
import { db } from '../../firebase'
import { doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Todo = ({ todo, path, id, length }) => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const handleDelete = async (id) => {
		//delete todo
		const todoDocRef = doc(db, `categories${path}/todos`, id)
		try {
			await deleteDoc(todoDocRef)
			const docuRef = doc(db, 'categories', path)
			updateDoc(docuRef, {
				todoCount: length - 1,
			})
			toast.success('Todo deleted successfully!')
		} catch (err) {
			alert(err)
		}
	}

	const handleComplete = async (id) => {
		//complete todo
		const todoDocRef = doc(db, `categories${path}/todos`, id)
		try {
			await updateDoc(todoDocRef, {
				completed: true,
			})
			toast.success('Todo completed successfully!')
		} catch (err) {
			alert(err)
		}
	}

	const handleIncomplete = async (id) => {
		//incomplete todo
		const todoDocRef = doc(db, `categories${path}/todos`, id)
		try {
			await updateDoc(todoDocRef, {
				completed: false,
			})
			toast.success('Todo marked as incomplete successfully!')
		} catch (err) {
			alert(err)
		}
	}

	return (
		<>
			<Card>
				<Card.Body className='d-flex justify-content-between justify-content-center align-items-center'>
					{todo.completed ? (
						<FaCheck color='#0f5132' />
					) : (
						<FaRegCircle color='#842029' />
					)}
					<div className={todo.completed ? null : 'completed'}>
						{todo.name}
					</div>
					<div className='d-flex justify-content-between'>
						<div>
							{todo.completed ? (
								<FaRegTimesCircle
									color='#842029'
									onClick={() => handleIncomplete(id)}
								/>
							) : (
								<FaRegCheckCircle
									color='#0f5132'
									onClick={() => handleComplete(id)}
								/>
							)}
						</div>
						<small className='todo_tools'>
							<FaPencilAlt color='#664d03' onClick={handleShow} />
							<FaTrash
								color='#842029'
								onClick={() => handleDelete(id)}
							/>
						</small>
					</div>
				</Card.Body>
			</Card>
			<EditTodo
				show={show}
				handleClose={handleClose}
				todoID={id}
				todoName={todo.name}
				todoPath={path}
			/>
		</>
	)
}

export default Todo

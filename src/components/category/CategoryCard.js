import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import './CategoryCard.css'
import { useState } from 'react'
import { db } from '../../firebase'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { doc, deleteDoc } from 'firebase/firestore'
import EditCategory from './EditCategory'

const CategoryCard = ({ category, id }) => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const handleDelete = async (id) => {
		const taskDocRef = doc(db, 'categories', id)
		try {
			await deleteDoc(taskDocRef)
			toast.success('Category deleted successfully!')
		} catch (err) {
			alert(err)
		}
	}
	return (
		<>
			<Col lg={4} className='my-1'>
				<Card border={category.colorCode.slice(1)}>
					<Card.Header
						className={`d-flex justify-content-between todo_${category.colorCode.slice(
							1
						)}`}
					>
						<Link to={`${id}`}>
							{category.name.toUpperCase()} CATEGORY
						</Link>
						<FaPencilAlt onClick={() => handleShow()} />
						<FaTrashAlt onClick={() => handleDelete(id)} />
					</Card.Header>

					<Card.Body>
						<Card.Text>{category.description}</Card.Text>
						<small
							className={`todo_${category.colorCode.slice(
								1
							)} px-2 py-1 rounded`}
						>
							Todos {category.todoCount}
						</small>
					</Card.Body>
					<Card.Footer>
						<small className={`text-muted`}>
							Added {category.created.toDate().toDateString()}
						</small>
					</Card.Footer>
				</Card>
			</Col>
			<EditCategory
				show={show}
				handleClose={handleClose}
				categoryName={category.name}
				categoryId={id}
				categoryDescription={category.description}
			/>
		</>
	)
}

export default CategoryCard

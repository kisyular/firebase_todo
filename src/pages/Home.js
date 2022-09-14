import Container from 'react-bootstrap/Container'
import CategoryCard from '../components/category/CategoryCard'
import HomeTodo from '../components/layout/HomeTodo'
import Row from 'react-bootstrap/Row'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
const Home = () => {
	const navigate = useNavigate()
	const [categories, setCategories] = useState([])

	useEffect(
		() => {
			const q = query(
				collection(db, 'categories'),
				orderBy('created', 'desc')
			)
			onSnapshot(q, (querySnapshot) => {
				setCategories(
					querySnapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data(),
					}))
				)
			})
			let authToken = sessionStorage.getItem('Auth Token')
			if (authToken) {
				navigate('/')
			}
			if (!authToken) {
				navigate('/login')
			}
		},
		// eslint-disable-next-line
		[navigate]
	)

	return (
		<Container style={{ minHeight: '90vh' }}>
			<HomeTodo />
			<Row xs={1} md={2} lg={4}>
				{
					//map through categories array and display each category
					categories.map((category) => {
						return (
							<CategoryCard
								key={category.id}
								category={category.data}
								id={category.id}
							/>
						)
					})
				}
			</Row>
		</Container>
	)
}

export default Home

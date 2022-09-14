import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import { auth } from '../../firebase'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { query, getDocs, collection, where } from 'firebase/firestore'

const NavBar = () => {
	const [buttonText, setButtonText] = useState('Login')
	const navigate = useNavigate()
	const [name, setName] = useState(null)

	const fetchUserName = async () => {
		try {
			const q = query(
				collection(db, 'users'),
				where('uid', '==', auth.currentUser?.uid)
			)
			const doc = await getDocs(q)
			const data = doc.docs[0].data()
			setName(data.name)
		} catch (err) {
			console.error(err)
			// alert('An error occured while fetching user data')
		}
	}

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setButtonText('Logout')
				fetchUserName()
			} else {
				setButtonText('Login')
			}
		})
	}, [buttonText, navigate])

	const handleLogout = () => {
		auth.signOut()
		sessionStorage.removeItem('Auth Token')
	}

	return (
		<>
			<Navbar bg='light' expand='lg'>
				<Container>
					<Navbar.Brand href='/'>
						<img
							src='/logo.png'
							width='30'
							height='30'
							className='d-inline-block align-top'
							alt='Todo App'
						/>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls='responsive-navbar-nav' />
					<Navbar.Collapse id='responsive-navbar-nav'>
						<Nav className='me-auto'>
							<Nav.Link as={Link} to='/'>
								Home
							</Nav.Link>
							<Nav.Link href='/'>Hi {name}</Nav.Link>
						</Nav>
						<Nav>
							<Nav.Link href='/login'>
								<Button
									onClick={handleLogout}
									variant='outline-danger'
								>
									{buttonText}
								</Button>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	)
}

export default NavBar

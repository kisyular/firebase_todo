import React from 'react'
import { Row, Container, Button, Form, Col } from 'react-bootstrap'
import { useState } from 'react'
import { auth } from '../firebase'
import { toast } from 'react-toastify'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import Spinner from 'react-bootstrap/Spinner'

export default function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading] = useAuthState(auth)
	const navigate = useNavigate()
	useEffect(() => {
		if (loading) {
			return (
				<Button variant='primary' disabled>
					<Spinner
						as='span'
						animation='grow'
						size='sm'
						role='status'
						aria-hidden='true'
					/>
					Loading...
				</Button>
			)
		}
		let authToken = sessionStorage.getItem('Auth Token')
		if (authToken) {
			navigate('/')
		}
		if (!authToken) {
			navigate('/login')
		}
	}, [navigate, loading])

	const handleAction = async (event) => {
		event.preventDefault()
		if (!email || !password) {
			return toast('Email and password required')
		}
		try {
			const user = await signInWithEmailAndPassword(auth, email, password)
			toast('User logged in successfully')
			setEmail('')
			setPassword('')
			navigate('/')
			sessionStorage.setItem(
				'Auth Token',
				user._tokenResponse.refreshToken
			)
		} catch (error) {
			if (error.code === 'auth/wrong-password') {
				toast.error('Invalid credentials')
			}
			if (error.code === 'auth/user-not-found') {
				toast.error('Invalid credentials')
			}
		}
	}
	return (
		<Container>
			<h1 className='text-center'>Login</h1>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Form>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
							<Form.Text className='text-muted'>
								We'll never share your email with anyone else.
							</Form.Text>
						</Form.Group>

						<Form.Group
							className='mb-3'
							controlId='formBasicPassword'
						>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
						</Form.Group>
						<Button
							variant='primary'
							type='submit'
							onClick={handleAction}
						>
							Login
						</Button>
					</Form>
					<p className='mt-4'>
						Don't have an account?{' '}
						<Link to='/register'>Register</Link> now.
					</p>
				</Col>
			</Row>
		</Container>
	)
}

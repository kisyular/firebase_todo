import React from 'react'
import { Row, Container, Button, Form, Col } from 'react-bootstrap'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'react-toastify'
import { auth, db } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'

export default function Register() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const navigate = useNavigate()

	const handleAction = async (event) => {
		event.preventDefault()
		const userRef = collection(db, 'users')
		if (!email || !password) {
			return toast('Email and password required')
		}
		try {
			const user = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			// console.log('user', user)
			sessionStorage.setItem(
				'Auth Token',
				user._tokenResponse.refreshToken
			)
			await addDoc(userRef, {
				name,
				email,
				uid: user.user.uid,
			})
			toast('User registered successfully')
			setName('')
			setEmail('')
			setPassword('')
			navigate('/')
		} catch (error) {
			console.log('error', error)
			if (error.code === 'auth/email-already-in-use') {
				toast.error('Email Already in Use')
			}
		}
	}
	return (
		<Container>
			<h1 className='text-center'>Register</h1>
			<Row>
				<Col md={{ span: 6, offset: 3 }}>
					<Form>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<Form.Label>Your name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter your name'
								onChange={(e) => setName(e.target.value)}
								value={name}
								required={true}
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='formBasicEmail'>
							<Form.Label>Email address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter your email'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required={true}
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
								required
							/>
						</Form.Group>
						<Button
							variant='primary'
							type='submit'
							onClick={handleAction}
						>
							Register
						</Button>
					</Form>
					<p className='mt-4'>
						If you have an account please{' '}
						<Link to='/login'>login</Link> here
					</p>
				</Col>
			</Row>
		</Container>
	)
}

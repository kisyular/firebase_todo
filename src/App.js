import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Todos from './pages/Todos'
import NavBar from './components/layout/NavBar'
// import Footer from './components/layout/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function App() {
	return (
		<>
			<Router>
				<NavBar />
				<ToastContainer />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/:todo' element={<Todos />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</Router>
			{/* <Footer /> */}
		</>
	)
}

export default App

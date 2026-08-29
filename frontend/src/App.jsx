import { useState } from 'react'

import Login from './pages/Login'
import RetailerDashboard from './pages/RetailerDashboard'
import DispatcherDashboard from './pages/DispatcherDashboard'
import RiderDashboard from './pages/RiderDashboard'
import Tracking from './pages/Tracking'

function App() {

  const [user, setUser] = useState(null)

  // Login
  const handleLogin = (userData) => {
    setUser(userData)
  }

  // Logout
  const handleLogout = () => {
    setUser(null)
  }

  const path = window.location.pathname

  // Public customer tracking page
  if (path === '/track') {
    return <Tracking />
  }

  // Show login page if nobody is logged in
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // Retailer dashboard
  if (user.role === 'retailer') {
    return (
      <RetailerDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  // Dispatcher dashboard
  if (user.role === 'dispatcher') {
    return (
      <DispatcherDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  // Rider dashboard
  if (user.role === 'rider') {
    return (
      <RiderDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  // Unknown role
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md text-center">

        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Role: {user.role}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </div>
  )
}

export default App
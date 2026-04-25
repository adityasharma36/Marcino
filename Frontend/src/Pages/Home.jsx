import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../store/Action/UserAction'

const Home = () => {
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <p className="text-gray-600">
          {user ? `Signed in as ${user.username || user.email || 'user'}` : 'No active user in Redux store'}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
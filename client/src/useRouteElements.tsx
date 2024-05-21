import { useRoutes } from 'react-router-dom'
import PostList from './pages/PostList'
import Login from './pages/Login'
import Register from './pages/Register'
import LoginLayout from './layouts/RegisterLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <PostList />
    },
    {
      path: '/login',
      element: (
        <LoginLayout>
          <Login />
        </LoginLayout>
      )
    },
    {
      path: 'register',
      element: (
        <LoginLayout>
          <Register />
        </LoginLayout>
      )
    }
  ])
  return routeElements
}

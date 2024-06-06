import { useRoutes } from 'react-router-dom'
import PostList from './pages/PostList'
import Login from './pages/Login'
import Register from './pages/Register'
import LoginLayout from './layouts/RegisterLayout'
import HomeLayout from './layouts/HomeLayout/HomeLayout'
import Home from './pages/Home'

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
      path: '/register',
      element: (
        <LoginLayout>
          <Register />
        </LoginLayout>
      )
    },
    {
      path: '/home',
      element: (
        <HomeLayout>
          <Home />
        </HomeLayout>
      )
    }
  ])
  return routeElements
}

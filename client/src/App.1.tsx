import useRouteElements from './useRouteElements'

export function App() {
  const routeElements = useRouteElements()
  return <div>{routeElements}</div>
}

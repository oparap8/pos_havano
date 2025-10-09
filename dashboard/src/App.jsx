import router from './routes'
import { RouterProvider } from 'react-router-dom'
// import { FrappeProvider } from "frappe-react-sdk"

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

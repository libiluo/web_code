import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import Accounting from "../pages/Accounting"
import Books from "../pages/Books"
import Mine from "../pages/mine"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "accounting", element: <Accounting /> },
      { path: "books", element: <Books /> },
      { path: "user", element: <Mine /> },
    ],
  },
])

export default router

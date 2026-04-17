import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import Home from "../pages/Home"
import Accounting from "../pages/Accounting"
import Books from "../pages/Books"
import Articles from "../pages/Articles"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "accounting", element: <Accounting /> },
      { path: "books", element: <Books /> },
      { path: "articles", element: <Articles /> },
    ],
  },
])

export default router

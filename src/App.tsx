import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/customer/home";
import Checkout from "./pages/customer/checkout";
import Layout from "./components/layout";
import AdminLayout from "./components/layoutAdmin";
import ManagerProduct from "./pages/admin/products";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/checkout",
          element: <Checkout />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      ),
      children: [
        {
          path: "/admin/quan-ly-san-pham",
          element: <ManagerProduct />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;

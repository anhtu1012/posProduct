import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/customer/home";
import Checkout from "./pages/customer/checkout";
import Layout from "./components/layout";

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
  ]);
  return <RouterProvider router={router} />;
}

export default App;

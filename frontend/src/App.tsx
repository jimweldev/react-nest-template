import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import PrivateLayout from "./layouts/private/PrivateLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import MainLayout from "./layouts/main/MainLayout";
import PublicLayout from "./layouts/public/PublicLayout";
import HomePage from "./pages/home/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import LoginPage from "./pages/public/auth/LoginPage";

const App = () => {
  const { accessToken } = useAuthStore((state: any) => ({
    accessToken: state.accessToken,
  }));

  // PRIVATE LAYOUT
  const privateRoutes = [
    {
      path: "",
      element: <PrivateLayout />, // private layout
      children: [
        {
          path: "",
          element: <AdminLayout />, // admin layout
          children: [
            {
              path: "",
              element: <AdminPage />,
            },
          ],
        },
        {
          path: "",
          element: <MainLayout />, // main layout
          children: [
            {
              path: "/home",
              element: <HomePage />,
            },
          ],
        },
      ],
    },
    {
      path: "/*",
      element: <Navigate to="/" replace />,
    },
  ];

  // PUBLIC LAYOUT
  const publicRoutes = [
    {
      path: "",
      element: <PublicLayout />, // public layout
      children: [
        {
          path: "",
          element: <LoginPage />, // login page
        },
      ],
    },
    {
      path: "/*",
      element: <Navigate to="/" replace />,
    },
  ];

  const router = createBrowserRouter(
    accessToken ? privateRoutes : publicRoutes
  );

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster expand={true} />
      </QueryClientProvider>
    </>
  );
};

export default App;

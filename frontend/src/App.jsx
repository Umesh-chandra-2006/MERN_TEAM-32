import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import UserDashboard from "./components/UserDashboard";
import InstructorDashboard from "./components/InstructorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import CourseDetails from "./components/CourseDetails";
import LearningView from "./components/LearningView";
import CourseEditor from "./components/CourseEditor";
import { useAuth } from "./store/useAuth";
import { useEffect } from "react";

function App() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "user-dashboard",
          element: <UserDashboard />,
        },
        {
          path: "instructor-dashboard",
          element: <InstructorDashboard />,
        },
        {
          path: "admin-dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "course/:courseId",
          element: <CourseDetails />,
        },
        {
          path: "learning/:courseId",
          element: <LearningView />,
        },
        {
          path: "create-course",
          element: <CourseEditor />,
        },
        {
          path: "edit-course/:courseId",
          element: <CourseEditor />,
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;

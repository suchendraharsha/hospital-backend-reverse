import Signup from "./signup/Signup";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/Login";
import HomePage from "./components/Home/HomePage";
import { AuthProvider } from "./context/AuthContext.js"; // Make sure the path is correct

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <div className="App">
      <AuthProvider> {/* Wrap RouterProvider with AuthProvider */}
        <RouterProvider router={route}></RouterProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
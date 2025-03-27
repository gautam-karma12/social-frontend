import "./App.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home/home.index";
import NotFound from "./pages/pageNotFound.index";
import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "./layout/index";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Signup";
import Profile from "./pages/Profile/profile.index";

function App() {
	return (
		<>
		<ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
		      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} /> */}


        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
		</>
	);
}

export default App;

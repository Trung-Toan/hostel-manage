import "./App.css";
import {
  matchPath,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import RouteUser from "./routes/RouteUser";
import HomePageAdmin from "./components/admin/HomePageAdmin";
import Error from "./components/error/Error";
import RouteAdmin from "./routes/RouteAdmin";

function App() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  const [userLogin, setUserLogin] = useState({});

  const handelIsLogin = (input) => {
    setIsLogin(input);
  };
  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    setUserLogin(currentUser);

    const isForgotPasswordPath = matchPath(
      "/forgot_password/:uid",
      location.pathname
    );

    if (!currentUser) {
      handelIsLogin(false);
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/find_email" &&
        !isForgotPasswordPath
      ) {
        navigate("/login");
      }
    }

    const interval = setInterval(() => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      setUserLogin(updatedUser);
      if (!updatedUser) {
        clearInterval(interval);
        handelIsLogin(false);
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/find_email" &&
          !isForgotPasswordPath
        ) {
          navigate("/login");
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <RouteUser
            isLogin={isLogin}
            handelIsLogin={handelIsLogin}
            userLogin={userLogin}
          />
        }
      />
      <Route
        path="/admin/*"
        element={
          userLogin != null && userLogin.role === 1 ? <RouteAdmin /> : <Error />
        }
      />
    </Routes>
  );
}

export default App;

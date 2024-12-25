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
import Error from "./components/error/Error";
import RouteAdmin from "./routes/RouteAdmin";
import RouteManager from "./routes/RouteManager";

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
    } else {
      // Kiểm tra role và điều hướng nếu truy cập sai đường dẫn
      const role = currentUser.role; // role = 0: user, 1: admin, 2: manager
      if (
        (role === 0 && location.pathname.startsWith("/admin")) ||
        (role === 0 && location.pathname.startsWith("/manager")) ||
        (role === 1 && !location.pathname.startsWith("/admin")) ||
        (role === 2 && !location.pathname.startsWith("/manager"))
      ) {
        navigate(role === 0 ? "/" : role === 1 ? "/admin" : "/manager");
      }
    }

    const interval = setInterval(() => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
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
      } else {
        // Kiểm tra role trong interval để đảm bảo an toàn
        const role = updatedUser.role;
        if (
          (role === 0 && location.pathname.startsWith("/admin")) ||
          (role === 0 && location.pathname.startsWith("/manager")) ||
          (role === 1 && !location.pathname.startsWith("/admin")) ||
          (role === 2 && !location.pathname.startsWith("/manager"))
        ) {
          navigate(role === 0 ? "/" : role === 1 ? "/admin" : "/manager");
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
          userLogin != null && userLogin.role === 1 ? (
            <RouteAdmin
              isLogin={isLogin}
              handelIsLogin={handelIsLogin}
              userLogin={userLogin}
            />
          ) : (
            <Error />
          )
        }
      />
      <Route
        path="/manager/*"
        element={
          userLogin != null && userLogin.role === 2 ? (
            <RouteManager
              isLogin={isLogin}
              handelIsLogin={handelIsLogin}
              userLogin={userLogin}
            />
          ) : (
            <Error />
          )
        }
      />
    </Routes>
  );
}

export default App;

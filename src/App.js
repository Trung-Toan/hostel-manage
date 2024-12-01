import "./App.css";
import {
  BrowserRouter,
  matchPath,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./components/common/home/HomePage";
import ViewPort from "./components/common/viewPort/ViewPort";
import Information from "./components/common/information/Information";
import ChangePassword from "./components/common/password/ChangePassword";
import Error from "./components/error/Error";
import Login from "./components/authen/Login";
import Register from "./components/authen/Register";
import EditInformation from "./components/common/information/EditInformation";
import ListInvoice from "./components/common/invoice/ListInvoice";
import InvoiceDetail from "./components/common/invoice/InvoiceDetail";
import { useGetAllInvoices, useGetAllPosts } from "./fetchData/DataFetch";
import FindEmail from "./components/authen/FindEmail";
import FogetPassword from "./components/authen/FogetPassword";

function App() {
  const navigate = useNavigate(); // Sử dụng hook useNavigate để điều hướng
  const [user, setUser] = useState({});
  const { invoices, loadingInvoice } = useGetAllInvoices();
  const { posts, loadingPost } = useGetAllPosts();
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState();

  const handelIsLogin = (input) => {
    setIsLogin(input);
  };
  // Kiểm tra người dùng đã đăng nhập chưa

  useEffect(() => {
    const userLogin = JSON.parse(sessionStorage.getItem("user"));
    const isForgotPasswordPath = matchPath(
      "/forgot_password/:uid",
      location.pathname
    );

    if (!userLogin) {
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
      const userLogin = JSON.parse(sessionStorage.getItem("user"));
      if (!userLogin) {
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
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [navigate, location.pathname]);

  // Hàm xử lý nhập liệu
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Danh sách các URL dùng chung
  const urlCommon = [
    { url: "/", name: "Home" },
    { url: "information", name: "Information" },
    { url: "change_password", name: "Change password" },
    { url: "list_invoice", name: "List invoice" },
    { url: "forgot_password", name: "Forgot password" },
  ];

  const handleSetEmail = (email) => {
    setEmail(email);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage urlCommon={urlCommon} login={isLogin} />}
      >
        <Route
          index
          element={<ViewPort posts={posts} loadingPost={loadingPost} />}
        />
        <Route path="information" element={<Information />} />
        <Route
          path="information/edit_information"
          element={<EditInformation />}
        />
        <Route path="change_password" element={<ChangePassword />} />
        <Route
          path="list_invoice"
          element={<ListInvoice invoices={invoices} loading={loadingInvoice} />}
        />
        <Route
          path="list_invoice/invoice/:idInvoice"
          element={<InvoiceDetail />}
        />
        <Route
          path="login"
          element={
            <Login
              user={user}
              handleInput={handleInput}
              handelIsLogin={handelIsLogin}
            />
          }
        />
        <Route path="register" element={<Register />} />
        <Route path="find_email" element={<FindEmail user={user} handleSetEmail = {handleSetEmail} />} />
        <Route path="forgot_password/:uid" element={<FogetPassword email={email}/>} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default App;

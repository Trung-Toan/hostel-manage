import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../components/common/home/HomePage";
import ViewPort from "../components/common/viewPort/ViewPort";
import EditInformation from "../components/common/information/EditInformation";
import ChangePassword from "../components/common/password/ChangePassword";
import Information from "../components/common/information/Information";
import ListInvoice from "../components/common/invoice/ListInvoice";
import InvoiceDetail from "../components/common/invoice/InvoiceDetail";
import Login from "../components/authen/Login";
import Register from "../components/authen/Register";
import FindEmail from "../components/authen/FindEmail";
import FogetPassword from "../components/authen/FogetPassword";
import Error from "../components/error/Error";
import { useGetAllInvoices, useGetAllPosts } from "../fetchData/DataFetch";

const RouteUser = ({isLogin, handelIsLogin, userLogin}) => {
  const [user, setUser] = useState({});
  const { invoices, loadingInvoice } = useGetAllInvoices();
  const { posts, loadingPost } = useGetAllPosts();
  const [email, setEmail] = useState();

  // Hàm xử lý nhập liệu
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSetEmail = (email) => {
    setEmail(email);
  };

  const urlCommon = [
    { url: "/", name: "Home" },
    { url: "information", name: "Information" },
    { url: "change_password", name: "Change password" },
    { url: "list_invoice", name: "List invoice" },
    { url: "forgot_password", name: "Forgot password" },
  ];
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage urlCommon={urlCommon} login={isLogin} />}
      >
        <Route
          index
          element={<ViewPort posts={posts} loadingPost={loadingPost} userLogin = {userLogin} />}
        />
        <Route path="information" element={<Information userLogin = {userLogin} />} />
        <Route path="information/edit_information" element={<EditInformation userLogin = {userLogin} />}/>
        <Route path="change_password" element={<ChangePassword />} />
        <Route
          path="list_invoice"
          element={
            <ListInvoice
              user={userLogin}
              invoices={invoices}
              loading={loadingInvoice}
            />
          }
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
        <Route
          path="find_email"
          element={<FindEmail user={user} handleSetEmail={handleSetEmail} />}
        />
        <Route
          path="forgot_password/:uid"
          element={<FogetPassword email={email} />}
        />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default RouteUser;

import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePageAdmin from "../components/admin/HomePageAdmin";
import ViewPort from "../components/common/viewPort/ViewPort";
import { useGetDataByUrl } from "../fetchData/DataFetch";
import Information from "../components/common/information/Information";
import EditInformation from "../components/common/information/EditInformation";
import CreateNewPost from "../components/common/viewPort/CreateNewPost";
import EditPost from "../components/common/viewPort/EditPost";
import CreateAccount from "../components/account/CreateAccount";
import ViewListAccount from "../components/account/ViewListAccount";
import ViewListUltility from "../components/ultilities/ViewListUltility";
import ViewListInvoice from "../components/invoice/ViewListInvoice";
import ViewListCategory from "../components/category/ViewListCategory";
import CreateNewInvoice from "../components/invoice/CreateNewInvoice";
import CreateNewUltility from "../components/ultilities/CreateNewUltility";
import CreateNewCategory from "../components/category/CreateNewCategory";
import InvoiceDetail from "../components/common/invoice/InvoiceDetail";
import EditInvoice from "../components/invoice/EditInvoice";
import ChangePassword from "../components/common/password/ChangePassword";

const RouteManager = ({userLogin }) => {
  const {data: posts, isLoading:loadingPost} = useGetDataByUrl("http://localhost:9999/post", "post");
  const {data: invoice, isLoading:loadingInvoice} = useGetDataByUrl("http://localhost:9999/invoice", "invoice");
  const {data: category, isLoading:loadingCategory} = useGetDataByUrl("http://localhost:9999/category", "category");
  const {data: utilities, isLoading:loadingUtilities} = useGetDataByUrl("http://localhost:9999/utilities", "utilities");
  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin userLogin={userLogin} />}>
        <Route index element={ <ViewPort posts={posts?.data} loadingPost={loadingPost} userLogin={userLogin} /> } />
        <Route path="information" element={<Information userLogin={userLogin} />} />
        <Route path="information/edit_information" element={<EditInformation userLogin={userLogin} />} />
        <Route path="change_password" element={<ChangePassword userLogin={userLogin}/>} />
        <Route path="add_new_post" element={<CreateNewPost/>} />
        <Route path="edit/:id" element={<EditPost/>} />
        <Route path='create_account' element = {<CreateAccount userLogin = {userLogin}/>} />
        <Route path='view_account' element = {<ViewListAccount userLogin = {userLogin} />} />
        <Route path='view_invoice' element = {<ViewListInvoice data={invoice} isLoading={loadingInvoice} />} />
        <Route path='create_invoice' element = {<CreateNewInvoice />} />
        <Route path='edit_invoice/:id' element = {<EditInvoice/>} />
        <Route path="invoice/:idInvoice" element={<InvoiceDetail />}/>
        <Route path='view_utilities' element = {<ViewListUltility data={utilities} isloading={loadingUtilities} />} />
        <Route path='create_utilities' element = {<CreateNewUltility />} />
        <Route path='view_utilities/edit_ultility/:id' element={<CreateNewUltility/>} />
        <Route path='view_category' element = {<ViewListCategory data={category} isLoading={loadingCategory} />} />
        <Route path='create_category' element = {<CreateNewCategory />} />
        <Route path="view_category/edit_category/:id" element={<CreateNewCategory/>} />
      </Route>
    </Routes>
  );
};

export default RouteManager;

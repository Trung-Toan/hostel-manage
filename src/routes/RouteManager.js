import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePageAdmin from "../components/admin/HomePageAdmin";
import ViewPort from "../components/common/viewPort/ViewPort";
import { useGetAllPosts } from "../fetchData/DataFetch";
import Information from "../components/common/information/Information";
import EditInformation from "../components/common/information/EditInformation";
import CreateNewPost from "../components/common/viewPort/CreateNewPost";
import EditPost from "../components/common/viewPort/EditPost";
import CreateAccount from "../components/account/CreateAccount";
import ViewListAccount from "../components/account/ViewListAccount";

const RouteManager = ({userLogin }) => {
  const { posts, loadingPost } = useGetAllPosts();
  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin userLogin={userLogin} />}>
        <Route index element={ <ViewPort posts={posts} loadingPost={loadingPost} userLogin={userLogin} /> } />
        <Route path="information" element={<Information userLogin={userLogin} />} />
        <Route path="information/edit_information" element={<EditInformation userLogin={userLogin} />} />
        <Route path="add_new_post" element={<CreateNewPost/>} />
        <Route path="edit/:id" element={<EditPost/>} />
        <Route path='create_account' element = {<CreateAccount userLogin = {userLogin}/>} />
        <Route path='view_account' element = {<ViewListAccount userLogin = {userLogin} />} />
      </Route>
    </Routes>
  );
};

export default RouteManager;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePageAdmin from '../components/admin/HomePageAdmin';
import ViewListHostel from '../components/admin/hostel/ViewListHostel';
import Information from '../components/common/information/Information';
import EditInformation from '../components/common/information/EditInformation';
import ChangePassword from '../components/common/password/ChangePassword';

const RouteAdmin = ({isLogin, handelIsLogin, userLogin}) => {
  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin />}>
        <Route index element={<ViewListHostel />} />
        <Route path="information" element={<Information userLogin = {userLogin} />} />
        <Route path="information/edit_information" element={<EditInformation userLogin = {userLogin} />}/>
        <Route path="change_password" element={<ChangePassword />} />
      </Route>
    </Routes>
  );
};

export default RouteAdmin;

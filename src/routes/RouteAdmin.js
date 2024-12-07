import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import HomePageAdmin from '../components/admin/HomePageAdmin';
import ViewListHostel from '../components/admin/hostel/ViewListHostel';
import Information from '../components/common/information/Information';
import EditInformation from '../components/common/information/EditInformation';
import ChangePassword from '../components/common/password/ChangePassword';
import { useQuery } from '@tanstack/react-query';
import { useGetData } from '../fetchData/DataFetch';
import EditHostel from '../components/admin/hostel/EditHostel';
import ViewListRoom from '../components/admin/room/ViewListRoom';

const RouteAdmin = ({isLogin, handelIsLogin, userLogin}) => {

  const {getData} = useGetData();
  const {data: hostel, isLoading: loadingHostel, error: errorHostel} = useQuery({
    queryFn: () => getData("http://localhost:9999/hostel"),
    queryKey: ['hostel'],
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin />}>
        <Route index element={<ViewListHostel data = {hostel} isLoading = {loadingHostel} />} />
        <Route path="information" element={<Information userLogin = {userLogin}/>} />
        <Route path="information/edit_information" element={<EditInformation userLogin = {userLogin}  />}/>
        <Route path="change_password" element={<ChangePassword />} />
        <Route path='edit_hostel/:hId' element = {<EditHostel/>} />
        <Route path='room' element = {<ViewListRoom/>} />
      </Route>
    </Routes>
  );
};

export default RouteAdmin;

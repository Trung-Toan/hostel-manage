import React, {} from 'react';
import { Routes, Route,} from 'react-router-dom';
import HomePageAdmin from '../components/admin/HomePageAdmin';
import ViewListHostel from '../components/admin/hostel/ViewListHostel';
import Information from '../components/common/information/Information';
import EditInformation from '../components/common/information/EditInformation';
import ChangePassword from '../components/common/password/ChangePassword';
import { useQuery } from '@tanstack/react-query';
import { useGetData } from '../fetchData/DataFetch';
import EditHostel from '../components/admin/hostel/EditHostel';
import ViewListRoom from '../components/admin/room/ViewListRoom';
import ViewDetailRoom from '../components/admin/room/ViewDetailRoom';
import AddNewHostel from '../components/admin/hostel/AddNewHostel';
import './label.css';
import AddNewRoom from '../components/admin/room/AddNewRoom';
import CreateAccount from '../components/account/CreateAccount';
import ViewListAccount from '../components/account/ViewListAccount';

const RouteAdmin = ({userLogin}) => {

  const {getData} = useGetData();
  const {data: hostel, isLoading: loadingHostel, error: errorHostel} = useQuery({
    queryFn: () => getData("http://localhost:9999/hostel"),
    queryKey: ['hostel'],
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  const { data: utilities } = useQuery({
    queryKey: ["utilities"],
    queryFn: () => getData("http://localhost:9999/utilities"),
    staleTime: 10000,
    cacheTime: 1000 * 60,
  });

  const statusMapping = {
    1: { id: 1, color: "success", label: "Đã có người ở" },
    2: { id: 2, color: "info", label: "Phòng đã đặt cọc" },
    3: { id: 3, color: "danger", label: "Cấm hoạt động" },
    default: { id: 0, color: "secondary", label: "Chưa ai ở" },
  };

  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin userLogin = {userLogin} />}>
        <Route index element={<ViewListHostel data = {hostel} isLoading = {loadingHostel} />} />
        <Route path="information" element={<Information userLogin = {userLogin}/>} />
        <Route path="information/edit_information" element={<EditInformation userLogin = {userLogin} />}/>
        <Route path="change_password" element={<ChangePassword />} />
        <Route path='edit_hostel/:hId' element = {<EditHostel hostelList = {hostel?.data} />} />
        <Route path='room/:rhId' element = {<ViewListRoom statusMapping = {statusMapping} />} />
        <Route path='room_detail/:roomId' element = {<ViewDetailRoom utilities={utilities} statusMapping = {statusMapping} />} />
        <Route path='create_hostel' element = {<AddNewHostel/>} />
        <Route path='create_room/:hId' element = {<AddNewRoom utilities={utilities} />} />
        <Route path='create_account' element = {<CreateAccount userLogin = {userLogin}/>} />
        <Route path='view_account' element = {<ViewListAccount userLogin = {userLogin} />} />
      </Route>
    </Routes>
  );
};

export default RouteAdmin;

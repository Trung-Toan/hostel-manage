import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePageAdmin from '../components/admin/HomePageAdmin';
import ViewListHostel from '../components/admin/hostel/ViewListHostel';

const RouteAdmin = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePageAdmin />}>
        <Route index element={<ViewListHostel />} />
        {/* Thêm các route con khác tại đây nếu cần */}
      </Route>
    </Routes>
  );
};

export default RouteAdmin;

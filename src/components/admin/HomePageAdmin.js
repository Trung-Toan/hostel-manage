import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './header/HeaderAdmin';

const HomePageAdmin = () => {
    return (
        <div>
            <AdminHeader/>
            this is home page for admin
            <Outlet />
        </div>
    );
};

export default HomePageAdmin;

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './header/HeaderAdmin';

const HomePageAdmin = () => {
    return (
        <div>
            <AdminHeader/>
            <Outlet />
        </div>
    );
};

export default HomePageAdmin;

import React from 'react';
import { Outlet } from 'react-router-dom';

const HomePageManager = () => {
    return (
        <div>
            this is home page for manager
            <Outlet/>
        </div>
    );
};

export default HomePageManager;
import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';

const HomePage = ({handleLogout, login}) => {
    return (
        <div style={{backgroundColor: "f8f9fa"}}>
            <Header handleLogout = {handleLogout} login = {login} />
            <Outlet/>
        </div>
    );
};

export default memo(HomePage);
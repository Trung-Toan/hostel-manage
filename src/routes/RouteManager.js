import React from 'react';
import { Route, Routes } from 'react-router-dom';
import EditPost from '../components/manager/post/EditPost';
import HomePageManager from '../components/manager/HomePageManager';

const RouteManager = () => {
    return (
        <Routes>
            <Route path='/home_manager' element={<HomePageManager/>} >
                <Route index element={<EditPost/>} />
            </Route>
        </Routes>
    );
};

export default RouteManager;
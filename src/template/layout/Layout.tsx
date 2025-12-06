import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../layouts/Header';
import Sidebar from '../../layouts/Sidebar';

export default function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header onToggleSidebar={() => {}} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar isOpen={true} />
        <div className="main-content flex-1 p-4 overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

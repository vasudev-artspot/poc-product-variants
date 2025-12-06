import React from 'react';
import { Outlet } from 'react-router-dom';

const Outer = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Outlet />
    </div>
  );
};

export default Outer;
"use client"
import React from 'react'
import SideNav from './_components/SideNav';
import Header from './_components/Header';
import { TotalUsageContext } from '../(context)/TotalUsageContext';

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [totalUsage,setTotalUsage] = React.useState<Number>(0);
  return (
    <TotalUsageContext.Provider value={{totalUsage,setTotalUsage}}>
    <div className='bg-slate-100 min-h-screen'>
        <div className='md:w-64 hidden md:block fixed'>
            <SideNav/>  
        </div>
        <div className='md:ml-64'>
          <Header/>
           {children}
        </div>
    </div>
    </TotalUsageContext.Provider>
  )
}

export default layout
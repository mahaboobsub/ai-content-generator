"use client"
import { FileClock, Home, Settings, WalletCards } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect } from 'react'
import UsageTrack from './UsageTrack'

function SideNav() {
    const MenuList=[
        {
            name:'Home',
            icon:Home,
            path:'/dashboard'
        },
        {
            name:'History',
            icon:FileClock,
            path:'/dashboard/history'
        },
        {
            name:'Billing',
            icon:WalletCards,
            path:'/dashboard/billing'
        },
        {
            name:'Settings',
            icon:Settings,
            path:'/dashboard/settings'
        }
        
    ]

    const filteredMenuList = MenuList.filter(menu => menu.name !== 'History' && menu.name !== 'Billing');

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    },[path])
  return (
    <div className='relative bg-white h-screen p-5 shadow-sm border'>
        <div className='flex justify-center '>
            <Image src={'/logo.svg'} alt='logo' width={120} height={100}/>
        </div>
        <hr className='my-6 border'/>
        <div className='mt-3'>
            {filteredMenuList.map((menu) => (
                <Link key={menu.path} href={menu.path}>
                    <div className={`flex gap-2 mb-2 p-2
                    hover:bg-primary hover:text-white rounded-lg cursor-pointer items-center
                    ${path == menu.path && 'bg-primary text-white'}`}>
                        <menu.icon className='h-7 w-7' />
                        <h2 className='text-lg'>{menu.name}</h2>    
                    </div>
                </Link>
            ))}
        </div>
        <div className='absolute bottom-10 left-0 w-full'>
            <UsageTrack/>
        </div>
    </div>
  )
}

export default SideNav
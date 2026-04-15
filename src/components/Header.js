import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Search } from 'lucide-react';
import Image from './Image';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className='p-5 shadow-sm bg-white border-b-2 flex justify-between items-center'>
      <div className='flex items-center gap-4'>
        <Image src={'/logo.svg'} alt='logo' width={100} height={40} 
          className="cursor-pointer"
          onClick={() => navigate('/dashboard')}
        />
        <div className='flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white'>
          <Search className='w-4 h-4 text-gray-400'/>
          <input type='text' placeholder='Search...' 
            className='outline-none text-sm'/>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <button 
          className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
            location.pathname === '/dashboard' 
              ? 'bg-primary text-white' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => navigate('/dashboard')}
        >
          Home
        </button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default Header;

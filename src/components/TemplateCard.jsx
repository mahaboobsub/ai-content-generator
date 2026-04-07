import React from 'react'
import { useNavigate } from 'react-router-dom'
import Image from './Image'

function TemplateCard(item) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/content/${item?.slug}`);
  };

  return (
    <div 
      onClick={handleClick}
      className='p-5 shadow-md border bg-white 
      flex flex-col gap-3 cursor-pointer hover:scale-105 transition-all'>
        <Image src={item.icon} alt='icon'
        width={50} height={50} />
        <h2 className='font-medium text-lg'>{item.name}</h2>
        <p className='text-gray-500 line-clamp-3'>{item.desc}</p>
    </div>
  );
}

export default TemplateCard
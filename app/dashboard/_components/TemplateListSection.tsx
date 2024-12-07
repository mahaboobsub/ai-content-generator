import React, { useEffect, useState } from 'react'

import TemplateCard from './TemplateCard'
import Templates from '@/app/(data)/Templates'

export interface TEMPLATE{
  slug: string
  name: string,
  desc: string,
  icon: string,
  category: string,
  aiPrompt: string,
  form?:FORM[]

}

export interface FORM{
  label: string,
  field: string,
  name: string,
  required?:boolean
}

function TemplateListSection({ userSearchInput }: { userSearchInput: string }) {

  const [templateList,setTemplateList]=useState(Templates)
  useEffect(()=>{

    if(userSearchInput){
      const filterData=Templates.filter(item=>
        item.name.toLowerCase().includes(userSearchInput.toLowerCase())
      );
      setTemplateList(filterData);
    } else {
      setTemplateList(Templates);
    }
  },[userSearchInput])
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-10 gap-5'>
                 
      {templateList.map((item:TEMPLATE,index:number)=>(
         <TemplateCard key={index} {...item}/>
      ))}
    </div>
  )
}

export default TemplateListSection
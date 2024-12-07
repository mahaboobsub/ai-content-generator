"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useContext, useEffect } from 'react'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';

function UsageTrack() { 

  const {user}=useUser();
  const {totalUsage,setTotalUsage}=useContext(TotalUsageContext)
  
  useEffect(()=>{
    user&&GetData();
  },[user])

  const GetData=async()=>{
    {/*@ts-ignore*/}
    const result:HISTORY=await db.select().from(AIOutput)
  .where(eq(AIOutput.createdBy, user?.primaryEmailAddress?.emailAddress || ''));
  GetTotalUsage(result);

  }

  const GetTotalUsage=(result: { aiResponnse: string | any[] }[])=>{
    let total:number=0;
    result.forEach((element: { aiResponnse: string | any[]; }) =>{
      total=total+Number(element.aiResponnse?.length);
      });
      setTotalUsage(total);
  }

  return (
    <div className='m-5'>
      
      <div className='bg-primary p-3 rounded-lg text-white'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h-2 bg-[#9981f9]  w-full rounded-full mt-3'>
          <div className='h-2 bg-white rounded-full' 
          style={{width:(totalUsage/10000)*100+'%'}}>
          </div>
        </div>
        <h2 className='text-sm my-1'>
          {totalUsage}/10,000 credits used
        </h2>
      </div>
      <Button variant={'secondary'} className='my-3 w-full text-primary'>Upgrade Plan</Button>
    </div>
  )
}

export default UsageTrack
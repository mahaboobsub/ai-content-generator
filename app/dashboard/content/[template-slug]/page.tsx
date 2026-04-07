"use client"
import React, { useEffect, useState } from 'react'
import Templates from '@/app/(data)/Templates'
import FormSection from '../_components/FormSection'
import OutputSection from '../_components/OutputSection'
import { Button } from '@/components/ui/button'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { chatSession } from '@/utils/AiModal'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext'
import { useRouter } from 'next/navigation'


function CreateNewContent(props) {
  const [params, setParams] = useState(null);

  useEffect(() => {
    props.params.then(setParams);
  }, [props.params]);

  const selectedTemplate = Templates?.find(
    (item) => item.slug === params?.['template-slug'] 
  );
  const [loading,setLoading]=useState(false);
  const [aiOutput,setAiOutput]=useState('');

  const {user}=useUser();
  const router=useRouter();
  const [totalUsage]=useContent(TotalUsageContext)

  const GenerateAIContent=async(formData)=>{
    if(totalUsage>=10000){
      {
        router.push('/dashboard/billing');
        return;}
    }
    setLoading(true);
    const SelectedPrompt=selectedTemplate?.aiPrompt;
    const FinalAIPrommpt=JSON.stringify(formData)+','+SelectedPrompt;
    const result=await chatSession.sendMessage(FinalAIPrommpt);
    

    setAiOutput(result?.response.text());
    await SaveInDb(JSON.stringify(formData),selectedTemplate?.slug,result?.response.text());
    setLoading(false);
  }

  const SaveInDb=async(formData,slug,aiResp)=>{
    const result= await db.insert(AIOutput).values({
      formData:formData,
      templateSlug:slug,
      aiResponnse:aiResp,
      createdBy:user?.primaryEmailAddress?.emailAddress || '',
      createdAt:moment().format('DD/MM/YYYY') || '',
    });
    console.log(result);
  }

  return (
    <div className='p-3'>
      <Link href={"/dashboard"}> 
        <Button> <ArrowLeft/> Back </Button>
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>
        {/* FormSection */}

        <FormSection selectedTemplate={selectedTemplate}
        userFromInput={(v) =>GenerateAIContent(v)} 
        loading={loading}/>
        {/* outputSection */}
        <div className='col-span-2'>
        <OutputSection aiOutput={aiOutput}/>
        </div>
      </div>
      </div> 
  )
}

export default CreateNewContent

function useContent(TotalUsageContext) {
  const context = React.useContext(TotalUsageContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a TotalUsageProvider');
  }
  const setContext = React.useState(context)[1];
  return [context, setContext];
}

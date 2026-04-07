import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Templates from '../data/Templates';
import FormSection from './FormSection';
import OutputSection from './OutputSection';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { chatSession } from '../utils/AiModal';
import { db } from '../utils/db';
import { AIOutput } from '../utils/schema';
import { useUser } from '@clerk/clerk-react';
import moment from 'moment';

function ContentGenerator() {
  const { templateSlug } = useParams();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const template = Templates?.find(
      (item) => item.slug === templateSlug 
    );
    setSelectedTemplate(template);
  }, [templateSlug]);

  const GenerateAIContent = async(formData) => {
    setLoading(true);
    const SelectedPrompt = selectedTemplate?.aiPrompt;
    const FinalAIPrommpt = JSON.stringify(formData) + ',' + SelectedPrompt;
    const result = await chatSession.sendMessage(FinalAIPrommpt);
    
    setAiOutput(result?.response.text());
    await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, result?.response.text());
    setLoading(false);
  };

  const SaveInDb = async(formData, slug, aiResp) => {
    const result = await db.insert(AIOutput).values({
      formData: formData,
      templateSlug: slug,
      aiResponnse: aiResp,
      createdBy: user?.primaryEmailAddress?.emailAddress || '',
      createdAt: moment().format('DD/MM/YYYY') || '',
    });
    console.log(result);
  };

  return (
    <div className='p-3'>
      <Button onClick={() => navigate('/dashboard')}>
        <ArrowLeft/> Back 
      </Button>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 py-5'>
        {/* FormSection */}
        <FormSection 
          selectedTemplate={selectedTemplate}
          userFromInput={(v) => GenerateAIContent(v)} 
          loading={loading}
        />
        {/* outputSection */}
        <div className='col-span-2'>
          <OutputSection aiOutput={aiOutput}/>
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator;

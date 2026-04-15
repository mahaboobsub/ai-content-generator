import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Templates from '../data/Templates';
import FormSection from './FormSection';
import OutputSection from './OutputSection';
import Header from './Header';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { chatSession } from '../utils/AiModal';
import { supabase } from '../utils/db';
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
    try {
      const SelectedPrompt = selectedTemplate?.aiPrompt;
      const FinalAIPrommpt = JSON.stringify(formData) + ',' + SelectedPrompt;
      const result = await chatSession.sendMessage(FinalAIPrommpt);
      
      const responseText = result?.response.text();
      setAiOutput(responseText);
      await SaveInDb(JSON.stringify(formData), selectedTemplate?.slug, responseText);
    } catch (error) {
      console.error('AI Generation Error:', error);
      setAiOutput(`**Error:** ${error.message || 'Failed to generate content.'}`);
    }
    setLoading(false);
  };

  const SaveInDb = async(formData, slug, aiResp) => {
    const { data, error } = await supabase
      .from('ai_output')
      .insert([{
        form_data: formData,
        template_slug: slug,
        ai_response: aiResp,
        created_by: user?.primaryEmailAddress?.emailAddress || '',
        created_at: moment().format('DD/MM/YYYY'),
      }]);
    
    if (error) {
      console.error('Error saving to Supabase:', error);
    } else {
      console.log('Saved to Supabase:', data);
    }
  };

  return (
    <div>
      <Header />
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
    </div>
  );
}

export default ContentGenerator;

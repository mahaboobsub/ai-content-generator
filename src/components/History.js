import React, { useEffect, useState } from 'react';
import Header from './Header';
import { supabase } from '../utils/db';
import { useUser } from '@clerk/clerk-react';
import Templates from '../data/Templates';
import { Copy } from 'lucide-react';

function History() {
  const { user } = useUser();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetHistory();
    }
  }, [user]);

  const GetHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_output')
      .select('*')
      .eq('created_by', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
    } else {
      setHistoryList(data);
    }
    setLoading(false);
  };

  const GetTemplateInfo = (slug) => {
    const template = Templates?.find((item) => item.slug === slug);
    return template;
  };

  return (
    <div className='bg-slate-100 min-h-screen'>
      <Header />
      <div className='p-10 max-w-7xl mx-auto'>
        <h2 className='font-bold text-3xl mb-5'>History</h2>
        <p className='text-gray-500 mb-8'>Search your previously generated AI content</p>

        <div className='bg-white shadow-sm border rounded-lg p-5'>
          {loading ? (
            <div className='text-center py-10'>Loading...</div>
          ) : historyList.length === 0 ? (
            <div className='text-center py-10 text-gray-500'>No history found. Generate some content first!</div>
          ) : (
            <div className='grid grid-cols-7 font-bold bg-gray-50 p-3 mt-5 rounded-t-lg border-b'>
              <h2 className='col-span-2'>TEMPLATE</h2>
              <h2 className='col-span-2'>AI RESPONSE</h2>
              <h2>DATE</h2>
              <h2>WORDS</h2>
              <h2>COPY</h2>
            </div>
          )}

          {historyList.map((item, index) => {
            const template = GetTemplateInfo(item.template_slug);
            return (
              <div key={index} className='grid grid-cols-7 p-3 border-b text-sm items-center hover:bg-slate-50 transition-all'>
                <div className='col-span-2 flex items-center gap-3 w-full pr-4'>
                  {template?.icon ? (
                    <img src={template.icon} alt="icon" width={30} height={30} />
                  ) : null}
                  <h2 className='font-semibold truncate text-black text-base'>{template?.name || item.template_slug}</h2>
                </div>
                
                <div className='col-span-2 pr-4'>
                  <p className='line-clamp-3 text-gray-600'>{item.ai_response}</p>
                </div>

                <div className='text-gray-500'>
                  {item.created_at}
                </div>

                <div className='text-gray-500'>
                  {item.ai_response ? item.ai_response.split(/\s+/).filter(word => word.length > 0).length : 0}
                </div>

                <div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(item.ai_response)}
                    className='text-primary hover:text-blue-700 flex items-center gap-2'
                  >
                    <Copy className='w-4 h-4' /> Copy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default History;

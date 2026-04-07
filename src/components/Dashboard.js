import React, { useState } from 'react';
import SearchSection from './SearchSection';
import TemplateListSection from './TemplateListSection';

function Dashboard() {
  const [userSearchInput, setUserSearchInput] = useState('');
  
  return (
    <div>
      {/* Search Section */}
      <SearchSection onSearchInput={(value) => setUserSearchInput(value)} />
      {/*Template List Section*/}
      <TemplateListSection userSearchInput={userSearchInput} />
    </div>
  );
}

export default Dashboard;

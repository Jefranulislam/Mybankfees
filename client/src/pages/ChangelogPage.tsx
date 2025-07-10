import { useState, useEffect } from 'react';
import axios from 'axios';

const ChangelogPage = () => {
  const [versionInfo, setVersionInfo] = useState({ workflow: '', bankCount: 0 });

  useEffect(() => {
    // Fetch version info from the server
    axios.get('/api/version-info')
      .then(response => setVersionInfo(response.data))
      .catch(error => console.error('Error fetching version info:', error));
  }, []);



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Changelog</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Version Workflow</h2>
        <p>{versionInfo.workflow}</p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Bank Information</h2>
        <p>Total Banks: {versionInfo.bankCount}</p>
      </div>
    </div>
  );
};

export default ChangelogPage;

import { useState, useEffect } from 'react';
import axios from 'axios';

const VisitorCounterPage = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Fetch visitor count from the server
    axios.get('/api/visitor-count')
      .then(response => setVisitorCount(response.data.count))
      .catch(error => console.error('Error fetching visitor count:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Visitor Counter</h1>
      <p className="text-xl">Total Visitors: {visitorCount}</p>
    </div>
  );
};

export default VisitorCounterPage;

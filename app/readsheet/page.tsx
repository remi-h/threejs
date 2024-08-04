// --- MEMO ---
// WATCH OUT: Index starts from 0, but displaying 1 as the first. Group num starts from 1.

'use client';
import React, { useEffect, useState } from 'react';
import readVectors from '@/api/ReadVectors';

const Readsheet: React.FC = () => {
  interface Vector {
    url: string;
    keywords: string[];
    values: {
      [group: number]: number[];
    };
  }
  const [vectors, setVectors] = useState<Vector[]>([]);
  const [showVectors, setShowVectors] = useState(false);

  useEffect(() => {
    const fetchVectors = async () => {
      try {
        const data = await readVectors();
        setVectors(data);
      } catch (error) {
        console.error('Error fetching vectors:', error);
      }
    };

    fetchVectors();
  }, []);

  const toggleVectors = () => {
    setShowVectors(!showVectors);
  };

  return (
    <main>
      <div className="m-auto max-w-4xl bg-gray-100 p-4">
        <h1>Data from the sheet: production</h1>
        <button onClick={toggleVectors} className="p-2 bg-blue-500 text-white">
          {showVectors ? 'Hide' : 'Show'} Vectors
        </button>
        {vectors.map((vector, index) => (
          <div key={index} className="mb-4 p-2 border rounded bg-white">
            <p className="font-semibold">{index + 1}</p>
            <a href={vector.url} className='underline'>{vector.url}</a>
            <div className="mb-2">
              <p>Keywords:</p>
              <p>{vector.keywords.join(', ')}</p>
            </div>
            <div>
              {showVectors && Object.entries(vector.values).map(([group, groupValues]) => (
                <div key={group} className="mb-2">
                  <p className="font-semibold">Vector for {index + 1}-{group}:</p>
                  <p>{groupValues.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Readsheet;
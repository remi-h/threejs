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
        {vectors.map((vector, index) => (
          <div key={index} className="mb-4 p-2 border rounded bg-white">
            <h2 className="font-bold">{index + 1} - Link: {vector.url}</h2>
            <div className="mb-2">
              <h3 className="font-semibold">Keywords:</h3>
              <p>{vector.keywords.join(', ')}</p>
            </div>
            <div>
              <button onClick={toggleVectors} className="p-2 bg-blue-500 text-white">
                {showVectors ? 'Hide' : 'Show'} Vectors
              </button>
              {showVectors && Object.entries(vector.values).map(([group, groupValues]) => (
                <div key={group} className="mb-2">
                  <h4 className="font-semibold">Vectors for Keyword {group}:</h4>
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
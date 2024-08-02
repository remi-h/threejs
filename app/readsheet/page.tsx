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

  return (
    <main>
      <div className="m-auto max-w-4xl bg-gray-100 p-4">
        <h1>Data from the sheet: production</h1>
        {vectors.map((vector, index) => (
          <div key={index} className="mb-4 p-2 border rounded bg-white">
            <h2 className="font-bold">Link: {vector.url}</h2>
            <div className="mb-2">
              <h3 className="font-semibold">Keywords:</h3>
              <p>{vector.keywords.join(', ')}</p>
            </div>
            <div>
              {Object.entries(vector.values).map(([group, groupValues]) => (
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
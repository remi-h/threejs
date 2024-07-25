'use client';

import React, { useState } from 'react';

type Vector = {
  name: string;
  values: string;
};

const parseVectors = (vectors: Vector[]) => {
  return vectors.map(vector => ({
    name: vector.name,
    values: vector.values.split(',').map(Number)
  }));
};

const magnitude = (vector: number[]) => {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
};

const handleCalculate = (vectors: Vector[]) => {
  const parsedVectors = parseVectors(vectors);
  plotPolarChart(parsedVectors);
};

const plotPolarChart = (vectors: { name: string; values: number[] }[]) => {
  const canvas = document.getElementById('polarChart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 30;

  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Plot the center vector (first input)
  const centerVector = vectors[0];
  const centerMagnitude = Math.sqrt(centerVector.values.reduce((sum, val) => sum + val * val, 0));
  const centerRadius = (centerMagnitude / Math.max(...vectors.map(v => Math.sqrt(v.values.reduce((sum, val) => sum + val * val, 0))))) * maxRadius;

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  ctx.fillStyle = 'red'; // Color for the center vector
  ctx.fill();
  ctx.closePath();

  // name
  ctx.font = '12px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(centerVector.name, centerX + 10, centerY);

  // Plot the rest of the vectors
  vectors.slice(1).forEach((vector, index) => {
    const angle = index * (2 * Math.PI / (vectors.length - 1));
    const magnitude = Math.sqrt(vector.values.reduce((sum, val) => sum + val * val, 0));
    const radius = (magnitude / Math.max(...vectors.map(v => Math.sqrt(v.values.reduce((sum, val) => sum + val * val, 0))))) * maxRadius;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = `hsl(${index * (360 / (vectors.length - 1))}, 100%, 50%)`;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e8e8e8';
    ctx.stroke();
    ctx.closePath();

    // Plot the name of the vector
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(vector.name, x + 10, y);
  });

};

export default function Logic() {
  const [vectors, setVectors] = useState<Vector[]>([{ name: '', values: '' }]);

  const handleAddVector = () => {
    setVectors([...vectors, { name: '', values: '' }]);
  };

  const handleRemoveVector = (index: number) => {
    const newVectors = vectors.slice();
    newVectors.splice(index, 1);
    setVectors(newVectors);
  };

  const handleVectorChange = (index: number, field: 'name' | 'values', value: string) => {
    const newVectors = vectors.slice();
    newVectors[index][field] = value;
    setVectors(newVectors);
  };

  return (
    <main>
      <div className="m-auto max-w-4xl bg-gray-100 p-4">
        <h1>Calc Cosine similarity</h1>
        <h2>Input</h2>
        {vectors.map((vector, index) => (
          <div key={index} className="mb-2 flex gap-1">
            <input
              type="text"
              value={vector.name}
              onChange={(e) => handleVectorChange(index, 'name', e.target.value)}
              placeholder="Vector Name"
              className="p-2 border border-gray-300"
            />
            <input
              type="text"
              value={vector.values}
              onChange={(e) => handleVectorChange(index, 'values', e.target.value)}
              placeholder="Values (comma separated)"
              className="p-2 border border-gray-300 w-full"
            />
            <button
              onClick={() => handleRemoveVector(index)}
              className="p-2 bg-red-500 text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddVector} className="mt-4 p-2 bg-green-500 text-white">
          Add Vector
        </button>
        <button onClick={() => handleCalculate(vectors)} className="mt-4 ml-2 p-2 bg-blue-500 text-white">
          Calculate
        </button>
        <canvas id="polarChart" width="500" height="500" className='bg-white'></canvas>
      </div>
    </main>
  );
}
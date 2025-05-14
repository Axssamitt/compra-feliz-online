
import React from 'react';
import Shop from './Shop';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="bg-dark-800 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <Shop />
      </div>
    </div>
  );
};

export default Index;

import React from 'react';
import ProductList from '../components/ProductList';
import { ProductProvider } from '../context/ProductContext';

const ProductManagerPage: React.FC = () => {
  return (
    <div className="min-h-screen  bg-gray-50 ">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ProductProvider>
          <ProductList />
        </ProductProvider>
      </div>
    </div>
  );
};

export default ProductManagerPage;
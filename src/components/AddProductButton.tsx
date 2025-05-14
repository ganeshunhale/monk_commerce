import React from 'react';
import { useProductContext } from '../context/ProductContext';

const AddProductButton: React.FC = () => {
  const { addProduct } = useProductContext();

  return (
    <button
      onClick={addProduct}
      className="px-4 py-2 border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors"
    >
      Add Product
    </button>
  );
};

export default AddProductButton;
import React from 'react';
import { useProductContext } from '../context/ProductContext';
import ProductItem from './ProductItem';
import AddProductButton from './AddProductButton';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const ProductList: React.FC = () => {
  const { products, reorderProducts } = useProductContext();
console.log({products});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);
      reorderProducts(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-semibold text-center mb-8">Add Products</h1>
      
      <div className="mb-6 grid grid-cols-2 gap-4 ">
        <div className="text-gray-700 font-medium ml-10">Product</div>
        <div className="text-gray-700 font-medium ml-10">Discount</div>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext 
          items={products.map((_, index) => `product-${index}`)} 
          strategy={verticalListSortingStrategy}
        >
          {products.map((product, index) => (
            <ProductItem 
              key={`product-${index}`} 
              product={product} 
              index={index} 
              showRemoveButton={products.length > 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-8 flex justify-center">
        <AddProductButton />
      </div>
    </div>
  );
};

export default ProductList;
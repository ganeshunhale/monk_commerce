import { useSortable } from '@dnd-kit/sortable';
import { GripVertical, X } from 'lucide-react';
import React from 'react'
import { useProductContext } from '../context/ProductContext';
import { Variant } from '../types/product';
import { CSS } from '@dnd-kit/utilities';
interface ProductVarientItemProps {
    variant: Variant;
  index: number;
  variantIndex: number;
}
const ProductVarientItem: React.FC<ProductVarientItemProps> = ({variant,index,variantIndex}) => {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
      } = useSortable({ id: `product-${variantIndex}` });
      const style = {
          transform: CSS.Transform.toString(transform),
          transition,
        };
      
    const { removeVariant } = useProductContext();
  return (
    <div ref={setNodeRef} style={style} className="grid  grid-cols-2 gap-4 items-center">
             
        
              <div className="bg-gray-50 rounded-md p-2 text-gray-700 flex  items-center justify-between">
              <div className="cursor-move touch-none" {...attributes} {...listeners}>
              <GripVertical size={18} className="text-gray-400" />
              </div>
                <span>{variant.title}</span>
                <button 
                  onClick={() => removeVariant(index, variantIndex)}
                  className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              <div className="text-gray-600">
                ${variant.price}
            </div>
              

              </div>
            </div>
  )
}

export default ProductVarientItem
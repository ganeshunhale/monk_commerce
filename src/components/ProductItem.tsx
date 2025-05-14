import React, { useState } from 'react';
import { Edit2, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { ProductWithDiscount } from '../types/product';
import DiscountInput from './DiscountInput';
import ProductPicker from './ProductPicker';
import { useProductContext } from '../context/ProductContext';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import ProductVarientItem from './ProductVarientItem';

interface ProductItemProps {
  product: ProductWithDiscount;
  index: number;
  showRemoveButton: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, index, showRemoveButton }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const {
    removeProduct,
    reorderVariants,
    updateProductDiscount,
    toggleVariantsVisibility,
    toggleDiscountVisibility
  } = useProductContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `product-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasMultipleVariants = product.variants.length > 1;
  const productNumber = index + 1;

  const handleEditClick = () => {
    setIsPickerOpen(true);
  };

  const handleDiscountChange = (value: string, type: 'flat' | 'percentage') => {
    updateProductDiscount(index, value, type);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[1]);
      const newIndex = parseInt(over.id.toString().split('-')[1]);
      reorderVariants(index, oldIndex, newIndex);
    }
  };
  console.log({ product });

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center mb-2">
        <div className="cursor-move touch-none" {...attributes} {...listeners}>
          <GripVertical size={18} className="text-gray-400" />
        </div>
        <span className="font-medium text-gray-700 mr-2">{productNumber}.</span>


        <div className="grid w-full grid-cols-2 gap-4 mb-2 items-center">
          <div className="flex items-center bg-gray-100 rounded-md p-2">
            <span className="text-gray-800 truncate">{product.title}</span>
            <button
              onClick={handleEditClick}
              className="ml-auto  p-1 text-gray-500 hover:text-gray-700"
            >
              <Edit2 size={16} />
            </button>
          </div>

          <div className="flex items-center">
            {!product.showDiscount ? (
              <button
                onClick={() => toggleDiscountVisibility(index)}
                className="px-3 py-1 text-sm border border-teal-500 text-teal-600 rounded hover:bg-teal-50"
              >
                Add Discount
              </button>
            ) : (
              <DiscountInput
                value={product.discountValue}
                type={product.discountType}
                onChange={handleDiscountChange}
              />
            )}

            {showRemoveButton && (
              <button
                onClick={() => removeProduct(index)}
                className="ml-2 p-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {hasMultipleVariants && (
        <button
          onClick={() => toggleVariantsVisibility(index)}
          className="ml-8 mt-2 text-blue-500 hover:text-blue-700 text-sm flex items-center"
        >
          {product.variantsVisible ? (
            <>Hide variants <ChevronUp size={14} className="ml-1" /></>
          ) : (
            <>Show variants <ChevronDown size={14} className="ml-1" /></>
          )}
        </button>
      )}

      
      {hasMultipleVariants && product.variantsVisible && (
        <div className="ml-8 space-y-2 mt-2">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={product.variants.map((_, variantIndex) => `product-${variantIndex}`)}
              strategy={verticalListSortingStrategy}
            >
              {product.variants.map((variant, variantIndex) => (
                <ProductVarientItem
                  key={`product-${variantIndex}`}
                  variant={variant}
                  index={index}
                  variantIndex={variantIndex}
                />
              ))}
            </SortableContext>
          </DndContext>

        </div>
      )}

      {isPickerOpen && (
        <ProductPicker
          onClose={() => setIsPickerOpen(false)}
          productIndex={index}
        />
      )}
    </div>
  );
};

export default ProductItem
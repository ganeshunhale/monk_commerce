import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';
import { Product, Variant } from '../types/product';

interface ProductPickerProps {
  onClose: () => void;
  productIndex: number;
}

interface SelectedItem {
  productId: number;
  variantId?: number;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ onClose, productIndex }) => {
  const { searchResults, searchTerm, setSearchTerm, searchLoading, replaceProduct } = useProductContext();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-overlay')) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  const handleProductSelect = (product: Product) => {
    const productVariantIds = product.variants.map(v => v.id);
    const selectedVariantIds = selectedItems
      .filter(item => item.productId === product.id && item.variantId)
      .map(item => item.variantId);

    const allVariantsSelected = productVariantIds.every(id =>
      selectedVariantIds.includes(id));

    if (allVariantsSelected) {
      setSelectedItems(prev =>
        prev.filter(item => item.productId !== product.id)
      );
    } else {
      const filteredItems = selectedItems.filter(item => item.productId !== product.id);

      const newItems = [
        ...filteredItems,
        ...product.variants.map(variant => ({
          productId: product.id,
          variantId: variant.id
        }))
      ];

      setSelectedItems(newItems);
    }
  };

  const handleVariantSelect = (product: Product, variant: Variant) => {
    const isSelected = selectedItems.some(
      item => item.productId === product.id && item.variantId === variant.id
    );

    if (isSelected) {
      setSelectedItems(prev =>
        prev.filter(item => !(item.productId === product.id && item.variantId === variant.id))
      );
    } else {
      setSelectedItems(prev => [
        ...prev,
        { productId: product.id, variantId: variant.id }
      ]);
    }
  };

  const isProductSelected = (product: Product) => {
    const productVariantIds = product.variants.map(v => v.id);
    const selectedVariantIds = selectedItems
      .filter(item => item.productId === product.id && item.variantId)
      .map(item => item.variantId);

    return productVariantIds.every(id => selectedVariantIds.includes(id));
  };

  const isVariantSelected = (product: Product, variant: Variant) => {
    return selectedItems.some(
      item => item.productId === product.id && item.variantId === variant.id
    );
  };

  const handleAddButtonClick = () => {
    const selectedProducts = searchResults.filter(product =>
      selectedItems.some(item => item.productId === product.id)
    ).map(product => {
      const selectedVariantIds = selectedItems
        .filter(item => item.productId === product.id && item.variantId)
        .map(item => item.variantId);

      return {
        ...product,
        variants: product.variants.filter(variant =>
          selectedVariantIds?.includes(variant.id)
        )
      };
    });

    replaceProduct(productIndex, selectedProducts);
    onClose();
  };

  const totalSelectedProducts = new Set(selectedItems.map(item => item.productId)).size;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 modal-overlay">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Select Products</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {searchLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No products found' : 'Search for products to display results'}
            </div>
          ) : (
            <div className="divide-y">
              {searchResults.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={isProductSelected(product)}
                      onChange={() => handleProductSelect(product)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex items-center">
                      {product.image && (
                        <img
                          src={product.image.src}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                      )}
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </div>

                  <div className="ml-7 space-y-2">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isVariantSelected(product, variant)}
                            onChange={() => handleVariantSelect(product, variant)}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm">{variant.title}</span>
                        </div>
                        <div className="flex items-center">
                          {/* <span className="text-sm text-gray-500 mr-4">99 available</span> */}
                          <span className="text-sm font-medium">${variant.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {totalSelectedProducts} {totalSelectedProducts === 1 ? 'product' : 'products'} selected
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddButtonClick}
              disabled={selectedItems.length === 0}
              className={`px-4 py-2 rounded-md text-white ${selectedItems.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700'
                }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
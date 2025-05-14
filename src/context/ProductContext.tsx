import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Product, ProductWithDiscount } from '../types/product';
import { searchProducts } from '../api/products';

interface ProductContextType {
  products: ProductWithDiscount[];
  setProducts: React.Dispatch<React.SetStateAction<ProductWithDiscount[]>>;
  loading: boolean;
  searchResults: Product[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchLoading: boolean;
  addProduct: () => void;
  removeProduct: (productIndex: number) => void;
  removeVariant: (productIndex: number, variantIndex: number) => void;
  updateProductDiscount: (productIndex: number, discountValue: string, discountType: 'flat' | 'percentage') => void;
  updateVariantDiscount: (productIndex: number, variantIndex: number, discountValue: string, discountType: 'flat' | 'percentage') => void;
  toggleVariantsVisibility: (productIndex: number) => void;
  toggleDiscountVisibility: (productIndex: number) => void;
  replaceProduct: (productIndex: number, newProducts: Product[]) => void;
  reorderProducts: (oldIndex: number, newIndex: number) => void;
  reorderVariants: (productIndex: number, oldIndex: number, newIndex: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductWithDiscount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (products.length === 0 && ! hasInitialized.current) {
      hasInitialized.current = true;
      addProduct();
    }
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setSearchLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const addProduct = () => {
    setProducts(prev => [
      ...prev,
      {
        id: Date.now(),
        title: 'Select Product',
        variants: [],
        discountValue: '',
        discountType: 'percentage',
        variantsVisible: true,
        showDiscount: false,
        empty: true
      }
    ]);
  };

  const removeProduct = (productIndex: number) => {
    if (products.length <= 1) return;
    setProducts(prev => prev.filter((_, index) => index !== productIndex));
  };

  const removeVariant = (productIndex: number, variantIndex: number) => {
    setProducts(prev => 
      prev.map((product, pIndex) => {
        if (pIndex !== productIndex) return product;
        return {
          ...product,
          variants: product.variants.filter((_, vIndex) => vIndex !== variantIndex)
        };
      })
    );
  };

  const toggleVariantsVisibility = (productIndex: number) => {
    setProducts(prev =>
      prev.map((product, index) =>
        index === productIndex
          ? { ...product, variantsVisible: !product.variantsVisible }
          : product
      )
    );
  };

  const toggleDiscountVisibility = (productIndex: number) => {
    setProducts(prev =>
      prev.map((product, index) =>
        index === productIndex && !product.empty
          ? { ...product, showDiscount: !product.showDiscount }
          : product
      )
    );
  };

  const updateProductDiscount = (
    productIndex: number, 
    discountValue: string, 
    discountType: 'flat' | 'percentage'
  ) => {
    setProducts(prev => 
      prev.map((product, index) => 
        index === productIndex 
          ? { ...product, discountValue, discountType } 
          : product
      )
    );
  };

  const updateVariantDiscount = (
    productIndex: number,
    variantIndex: number,
    discountValue: string,
    discountType: 'flat' | 'percentage'
  ) => {
    setProducts(prev => 
      prev.map((product, pIndex) => {
        if (pIndex !== productIndex) return product;
        
        const updatedVariants = product.variants.map((variant, vIndex) => {
          if (vIndex !== variantIndex) return variant;
          return {
            ...variant,
            discountValue,
            discountType
          };
        });
        
        return { ...product, variants: updatedVariants };
      })
    );
  };

  const replaceProduct = (productIndex: number, newProducts: Product[]) => {
    const productsWithDiscount: ProductWithDiscount[] = newProducts.map(product => ({
      ...product,
      discountValue: '',
      discountType: 'percentage',
      variantsVisible: true,
      showDiscount: false,
      variants: product.variants.map(variant => ({
        ...variant,
        discountValue: '',
        discountType: 'percentage',
        showDiscount: false
      }))
    }));

    setProducts(prev => {
      const updatedProducts = [...prev];
      updatedProducts.splice(productIndex, 1, ...productsWithDiscount);
      return updatedProducts;
    });
  };

  const reorderProducts = (oldIndex: number, newIndex: number) => {
    setProducts(prev => {
      const updatedProducts = [...prev];
      const [movedProduct] = updatedProducts.splice(oldIndex, 1);
      updatedProducts.splice(newIndex, 0, movedProduct);
      return updatedProducts;
    });
  };

  const reorderVariants = (productIndex: number, oldIndex: number, newIndex: number) => {
    setProducts(prev => 
      prev.map((product, index) => {
        if (index !== productIndex) return product;
        
        const updatedVariants = [...product.variants];
        const [movedVariant] = updatedVariants.splice(oldIndex, 1);
        updatedVariants.splice(newIndex, 0, movedVariant);
        
        return { ...product, variants: updatedVariants };
      })
    );
  };

  const value = {
    products,
    setProducts,
    loading,
    searchResults,
    searchTerm,
    setSearchTerm,
    searchLoading,
    addProduct,
    removeProduct,
    removeVariant,
    updateProductDiscount,
    updateVariantDiscount,
    toggleVariantsVisibility,
    toggleDiscountVisibility,
    replaceProduct,
    reorderProducts,
    reorderVariants
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
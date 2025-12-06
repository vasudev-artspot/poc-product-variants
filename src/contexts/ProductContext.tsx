import { createContext, useState, useContext } from "react";
import { IProductBasicInfo, ProductFormContextType, ProductFormData } from "../interface/product.interface";

// Create default values
const productDefaultValues: IProductBasicInfo = {
  title: "",
  description: "",
  sku: "",
  salePrice: 0,
  discountType: "",
  discountValue: 0,
  shop: 0,
  categories: [],
  socialMediaLinks: []
};

// Create context
export const ProductContext = createContext<ProductFormContextType | undefined>(undefined);

// Provider component
export const ProductFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    productData: productDefaultValues
  });

  const updateFormData = (data: Partial<IProductBasicInfo>) => {
    setFormData(prev => ({
      productData: {
        ...prev.productData,
        ...data
      }
    }));
  };

  return (
    <ProductContext.Provider value={{ formData, updateFormData }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook
export const useProductFormContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProductFormContext must be used within ProductFormProvider");
  return context;
};
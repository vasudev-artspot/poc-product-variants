import React, { useState } from "react";
import { ProductFormProvider } from "../contexts/ProductContext";
import Tabs from "../components/common/Tabs";
import TabPanel from "../components/common/TabPanel";
import View from "../components/products/View";
import { ProductForm } from "../views/Products/ProductForm";
import { ProductFormSchema } from "../views/Products/Validation/productValidationSchema";
import { defaultProductsValues } from "../constant/products/defaultValues";
import { tabs } from "../constant/products/common";
import { ProductEditForm } from "../views/Products/Edit/ProductEditForm";
import { useQueryClient } from "react-query";
import { Typography } from "@mui/material";

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleUpdateProduct = (productId: string) => {
    console.log('Setting editing product ID:', productId);
    setEditingProductId('1');
    setActiveTab("edit");
  };

  // Create a stable refetch function
  const refetchProducts = React.useCallback(() => {
    return queryClient.invalidateQueries('products');
  }, [queryClient]);

  return (
    <div className="flex-1 p-4">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <TabPanel value="create">
        <ProductFormProvider>
            <ProductForm setActiveTab={setActiveTab} />
          </ProductFormProvider>
        </TabPanel>
        <TabPanel value="edit">
          <ProductFormProvider>
            {editingProductId ? (
              <ProductEditForm productId={editingProductId} />
            ) : (
              <Typography>No product selected for editing</Typography>
            )}
          </ProductFormProvider>
        </TabPanel>
        <TabPanel value="view-all">
          <View onUpdateBtnClick={handleUpdateProduct} refetchProducts={refetchProducts} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Products;

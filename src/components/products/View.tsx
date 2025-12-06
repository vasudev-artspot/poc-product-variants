import React, { useEffect, useState } from "react";
import { Box, TextField, InputAdornment, CircularProgress, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, useMutation } from "react-query";
import { useAlert } from "../../utils/AlertBar";
import { fetchAllProductsRequest, deleteProductRequest } from "../../services/products/ProductRequest";
import ProductCard from "../../pages/products/ProductCard";
import ConfirmationDialog from "../common/modal/ConfirmationDialog";

interface ViewProps {
  onUpdateBtnClick: (id: string) => void;
  refetchProducts: () => void;
}

const ProductView: React.FC<ViewProps> = ({ onUpdateBtnClick, refetchProducts }) => {
  const { showAlert } = useAlert();
  const [isDeleteProduct, setIsDeleteProduct] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery("products", () => 
    fetchAllProductsRequest(searchTerm),
  {
    refetchOnWindowFocus: true,
  });

  const { mutate: deleteProduct, isLoading: isDeleting } = useMutation(
    () => deleteProductRequest({ productDeleteInput: { id: 13 } }), // Hardcoded ID 10
    {
      onSuccess: (response) => {
        console.log('Delete successful, response:', response);
        if (response?.deleteProduct?.productDeleteResult?.code) {
          showAlert("Product deleted successfully!", "success");
          refetch();
        } else {
          showAlert("Failed to delete product", "error");
        }
      },
      onError: (error: any) => {
        console.error('Delete error:', error);
        showAlert(error.message || "Failed to delete product", "error");
      }
    }
  );

  const handleConfirmDeleteProduct = () => {
    deleteProduct(); // No need to pass ID since it's hardcoded
    setIsDeleteProduct(false);
  };

  const handleCancelConfirmDeleteProduct = () => {
    console.log('User cancelled deletion');
    setIsDeleteProduct(false);
  };

  useEffect(() => {
    if (typeof refetchProducts === 'function') {
      refetchProducts();
    }
  }, [refetchProducts]);

  const products = data?.products?.productNodes?.products?.edges || [];
  const filteredProducts = products.filter((productEdge: any) => 
    productEdge.node.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(products,"Product Data//////////////////");
  

  if (isLoading) return <CircularProgress />;
  if (error) {
    console.error("Error fetching products:", error);
    return <Typography color="error">Error loading products</Typography>;
  }

  return (
    <>
      {/* Search Bar */}
      <Box sx={{ mb: 2, width: '30%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Product Cards Grid */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 3,
        padding: 2
      }}>
        {filteredProducts.length ? (
          filteredProducts.map((productEdge: any) => (
            <ProductCard
              key={productEdge.node.id}
              productName={productEdge.node.title}
              productImage={productEdge.node.imageUrl}
              onEdit={() => {
                console.log('Edit clicked for product ID:', productEdge); 
                onUpdateBtnClick(productEdge.node.id);
              }}
              onDelete={() => {
                setIsDeleteProduct(true);
              }}
            />
          ))
        ) : (
          <Typography variant="body1">
            {searchTerm ? 'No matching products found' : 'No products available'}
          </Typography>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      {isDeleteProduct && (
        <ConfirmationDialog
          open={isDeleteProduct}
          title="Confirm Delete"
          description="Are you sure you want to delete product?"
          onConfirm={handleConfirmDeleteProduct}
          onCancel={handleCancelConfirmDeleteProduct}
         
        />
      )}
    </>
  );
};

export default ProductView;
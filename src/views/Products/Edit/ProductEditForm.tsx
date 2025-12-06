import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  CircularProgress,
  SelectChangeEvent,
  TextField,
  InputAdornment
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useAlert } from "../../../utils/AlertBar";
import InputField from "../../../components/common/inputs/InputField";
import SelectField from "../../../components/common/inputs/SelectField";
import SearchSelect from "../../../components/common/SearchSelect/SearchSelect";
import { categoriesSearchRequest, fetchAllShopsRequest } from "../../../services/shops/ShopRequest";
import { updateProductRequest, fetchProductByIdRequest } from "../../../services/products/ProductRequest";
import { discountTypeOptions, socialMediaOptions } from "../../../constant/products/options";
import TextAreaField from "../../../components/common/inputs/TextAreaField";
import ShopCard from "../../../components/common/ShopCard/ShopCard";
import { useProductFormContext } from "../../../contexts/ProductContext";
import { IProductBasicInfo, IProductUpdateInput } from "../../../interface/product.interface";

interface ShopNode {
  id: string;
  name: string;
}

interface Option {
  label: string;
  value: string;
}

interface ShopEdge {
  node: ShopNode;
}

interface AllShopsResponse {
  allShops: {
    __typename: string;
    message?: string;
    allShopNodesResult: {
      edges: ShopEdge[];
    };
  };
}

interface ProductFormValues extends IProductBasicInfo {
  socialMediaLinks: Array<{
    platformType: string;
    platformHandle: string;
    operationName: 'ADD' | 'REMOVE' | 'NONE';
  }>;
  categoriesForm: Array<{
    id: number;
    name: string;
  }>;
}

interface ProductEditFormProps {
  productId: string;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ productId }) => {
  console.log('ProductEditForm received productId:', productId);
  const { formData, updateFormData } = useProductFormContext();
  const { showAlert } = useAlert();
  const methods = useForm<ProductFormValues>();
  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = methods;

  const [loading, setLoading] = useState(true);
  const [openShopPopup, setOpenShopPopup] = useState(false);
  const [shopSearchText, setShopSearchText] = useState("");
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const categories = getValues("categories") || [];


  // Fetch product data
//   const { data: productData, refetch } = useQuery(
//     ['product', productId],
//     () => fetchProductByIdRequest(productId),
//     {
//       enabled: !!productId,
//       onSuccess: (data) => {
//         const product = data?.productById?.productsNodeResult;
//         if (product) {
//           setInitialData(product);
//           // Set form values
//           setValue('title', product.title);
//           setValue('description', product.description);
//           setValue('sku', product.sku || '');
//           setValue('salePrice', product.salePrice);
//           setValue('discountType', product.discountType);
//           setValue('discountValue', product.discountValue);
          
//           // Set shop
//           if (product.shop) {
//             setSelectedShop({
//               id: product.shop.id,
//               shopName: product.shop.name
//             });
//             setValue('shop', Number(product.shop.id));
//           }
          
//           // Set categories
//           if (product.categories && product.categories.length > 0) {
//             const categoriesForm = product.categories.map((cat: any) => ({
//               id: cat.id,
//               name: cat.name
//             }));
//             setValue('categoriesForm', categoriesForm);
//             setValue('categories', categoriesForm.map((c: any) => c.id));
//           }
          
//           // Set social media links
//           if (product.socialMediaLinks && product.socialMediaLinks.length > 0) {
//             const links = product.socialMediaLinks.map((link: any) => ({
//               platformType: link.platformName.toLowerCase(),
//               platformHandle: link.platformUrl,
//               operationName: 'NONE' as const
//             }));
//             setValue('socialMediaLinks', links);
//           }
//         }
//         setLoading(false);
//       },
//       onError: (error) => {
//         console.error("Error fetching product:", error);
//         showAlert("Failed to load product data", "error");
//         setLoading(false);
//       }
//     }
//   );

const { data: productData, refetch } = useQuery(
    ['product', productId],
    () => {
      if (!productId) {
        console.log('No product ID, skipping fetch');
        return Promise.resolve(null); // Return null if no productId
      }
      console.log('Fetching product with ID:', productId);
      return fetchProductByIdRequest(productId);
    },
    {
      enabled: !!productId, // Only enable the query if productId exists
      onSuccess: (data) => {
        if (data?.productById?.productsNodeResult) {
          const product = data.productById.productsNodeResult;
          setInitialData(product);
          // Set form values...
          setValue('title', product.title);
          setValue('description', product.description);
          setValue('sku', product.sku || '');
          setValue('salePrice', product.salePrice);
        //   setValue('discountType', product.discountType);
        setValue('discountType', "PERCENTAGE");
          setValue('discountValue', product.discountValue);
          
          // Set shop
          if (product.shop) {
            setSelectedShop({
              id: product.shop.id,
              shopName: product.shop.name
            });
            setValue('shop', Number(product.shop.id));
          }
          
          // Set categories
          if (product.categories && product.categories.length > 0) {
            const categoriesForm = product.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name
            }));
            setValue('categoriesForm', categoriesForm);
            setValue('categories', categoriesForm.map((c: any) => c.id));
          }
          
          // Set social media links
          if (product.socialMediaLinks && product.socialMediaLinks.length > 0) {
            console.log(product,"<<<<<<<<<<<>>>>>>>>>>>>>>>>>>");
            
            const links = product.socialMediaLinks.map((link: any) => ({
              platformType: link.platformName.toLowerCase(),
              platformHandle: link.platformUrl,
              operationName: 'NONE' as const
            }));
            setValue('socialMediaLinks', links);
          }
        }
        setLoading(false);
      },
      onError: (error) => {
        console.error("Error fetching product:", error);
        showAlert("Failed to load product data", "error");
        setLoading(false);
      }
    }
  );

  useEffect(() => {
    console.log('ProductEditForm mounted with ID:', productId);
    return () => console.log('ProductEditForm unmounted');
  }, []);
  

  // Mutation for product update
  const { mutate: updateProductMutate, isLoading: isSubmitting } = useMutation(
    updateProductRequest,
    {
      onSuccess: (response) => {
        if (response?.updateProduct?.productUpdateResult?.product) {
          showAlert("Product updated successfully!", "success");
          refetch();
        } else if (response?.updateProduct?.errors) {
          const errorMsg = response.updateProduct.errors[0]?.message || "Update failed";
          showAlert(errorMsg, "error");
        } else {
          showAlert("Unexpected response from server", "error");
        }
      },
      onError: (error: any) => {
        console.error("Network error:", error);
        showAlert(error.message || "Failed to update product", "error");
      }
    }
  );

  // Fetch shops for popup
  const fetchShops = async (searchTerm = "") => {
    setLoadingShops(true);
    try {
      const response: AllShopsResponse = await fetchAllShopsRequest(searchTerm);
  
      if (response.allShops.__typename === "ShopAllNodesQuerySuccess") {
        const fetchedShops = response.allShops.allShopNodesResult.edges.map(
          (edge) => ({
            id: edge.node.id,
            shopName: edge.node.name,
          })
        );
        setShops(fetchedShops);
      } else {
        console.error(response.allShops.message);
        setShops([]);
      }
    } catch (err) {
      console.error("An error occurred while fetching shops:", err);
      setShops([]);
    } finally {
      setLoadingShops(false);
    }
  };

  // Handle shop selection
  const handleShopSelection = (shop: any) => {
    setSelectedShop(shop);
    setValue("shop", Number(shop.id), { shouldValidate: true });
    setOpenShopPopup(false);
  };

  // Remove selected shop
  const handleRemoveShop = () => {
    setSelectedShop(null);
    setValue("shop", 0, { shouldValidate: true });
  };

  const fetchCategories = async (searchText: string) => {
    try {
      const response = await categoriesSearchRequest(searchText);
      if (response.categoriesSearch.__typename === "CategoryQuerySuccess") {
        return (
          response.categoriesSearch.categories?.map((category: any) => ({
            label: category.name,
            value: category.id.toString(),
            rawValue: category
          })) || []
        );
      }
      return [];
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  };

  const handleUpdateCategoryData = (newCategory: any) => {
    const updatedCategories = [...categories, newCategory];
    setValue("categories", updatedCategories, { shouldValidate: true });
  };    

  const formatProductUpdateData = (formData: ProductFormValues): IProductUpdateInput => {
    const updateData: IProductUpdateInput = {
        id: Number(productId),
        title: formData.title,
        description: formData.description,
        sku: formData.sku,
        salePrice: formData.salePrice,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        shop: formData.shop,
        categories: [],
        socialMediaLinks: []
    };

    // Handle categories (keep this part the same as before)
    const currentCategories = initialData?.categories?.map((c: any) => c.id) || [];
    const updatedCategories = formData.categories || [];

    updateData.categories = updatedCategories.map(categoryId => {
        const wasAssigned = currentCategories.includes(categoryId);
        return {
            categoryId,
            operationName: wasAssigned ? 'NONE' : 'ADD'
        };
    });

    const removedCategories = currentCategories.filter((id: number) => 
        !updatedCategories.includes(id)
    ).map((id: any) => ({
        categoryId: id,
        operationName: 'REMOVE'
    }));

    updateData.categories = [...updateData.categories, ...removedCategories];

    // Handle social media links - updated to match schema
    const currentLinks = initialData?.socialMediaLinks || [];
    const updatedLinks = formData.socialMediaLinks || [];

    // Create a map of current links by platform name (lowercase for comparison)
    const currentLinksMap = new Map<string, string>(
        currentLinks.map((link: any) => [link.platformName.toLowerCase(), link.platformUrl])
    );

    // Create Set of updated platform names (lowercase)
    const updatedPlatforms = new Set(updatedLinks.map(l => l.platformType.toLowerCase()));

    updateData.socialMediaLinks = updatedLinks.map(link => {
        const currentUrl = currentLinksMap.get(link.platformType.toLowerCase());
        
        if (!currentUrl) {
            // New link
            return {
                socialMediaPlatform: link.platformType.toUpperCase(), // Match expected case
                // platformUrl: link.platformHandle,
                operationName: 'ADD' as const
            };
        } else if (currentUrl !== link.platformHandle) {
            // Updated link
            return {
                socialMediaPlatform: link.platformType.toUpperCase(),
                // platformUrl: link.platformHandle,
                operationName: 'NONE' as const
            };
        } else {
            // Unchanged link
            return {
                socialMediaPlatform: link.platformType.toUpperCase(),
                // platformUrl: link.platformHandle,
                operationName: 'NONE' as const
            };
        }
    });

    // Add removed links
    const removedLinks = Array.from(currentLinksMap.entries())
        .filter(([platform]) => !updatedPlatforms.has(platform.toLowerCase()))
        .map(([socialMediaPlatform, platformUrl]) => ({
            socialMediaPlatform: socialMediaPlatform.toUpperCase(),
            // platformUrl: '',
            operationName: 'REMOVE' as const
        }));

    updateData.socialMediaLinks = [...updateData.socialMediaLinks, ...removedLinks];

    return updateData;
};



    const onSubmit = (formData: ProductFormValues) => {
        try {
          const updateData = formatProductUpdateData(formData);
          console.log("Update payload:", updateData);
          updateProductMutate({ productUpdateInput: updateData });
        } catch (error) {
          console.error("Error formatting update data:", error);
          showAlert("Error preparing update data", "error");
        }
    };

  // Handle social media links changes
  const handleSocialMediaLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...(watch("socialMediaLinks") || [])];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value,
      operationName: updatedLinks[index].operationName === 'NONE' ? 'NONE' : 'ADD'
    };
    setValue("socialMediaLinks", updatedLinks, { shouldValidate: true });
  };

  const addSocialMediaLink = () => {
    const currentLinks = watch("socialMediaLinks") || [];
    setValue("socialMediaLinks", [
      ...currentLinks,
      { platformType: "", platformHandle: "", operationName: 'ADD' }
    ], { shouldValidate: true });
  };

  const removeSocialMediaLink = (index: number) => {
    const currentLinks = [...(watch("socialMediaLinks") || [])];
    const removedLink = currentLinks[index];
    
    // If the link was in the initial data, mark it for removal
    if (initialData?.socialMediaLinks?.some(
      (l: any) => l.platformName.toLowerCase() === removedLink.platformType
    )) {
      currentLinks[index] = {
        ...removedLink,
        operationName: 'REMOVE'
      };
    } else {
      // If it was a newly added link, just remove it
      currentLinks.splice(index, 1);
    }
    
    setValue("socialMediaLinks", currentLinks, { shouldValidate: true });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!productId) {
    return <Typography>No product selected for editing</Typography>;
  }

  if (!productData?.productById?.productsNodeResult) {
    return <Typography>Product data not available</Typography>;
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "50%" }}>
      {/* Product Title */}
      <InputField
        label="Product Title"
        name="title"
        register={register}
        required="Product title is required"
        placeholder="Enter Product Title"
        error={!!errors.title}
        errorMessage={errors.title?.message as string}
        testId="pro-title"
      />

      {/* Product Description */}
      <TextAreaField
        label="Description"
        name="description"
        register={register}
        required="Product description is required"
        minLength={{
          value: 10,
          message: "Description must be at least 10 characters",
        }}
        placeholder="Provide a description for the product"
        error={!!errors.description}
        errorMessage={errors.description?.message as string}
        testId="pro-desc"
      />

      {/* SKU */}
      <InputField
        label="SKU (Stock Keeping Unit)"
        name="sku"
        register={register}
        placeholder="Enter SKU"
        error={!!errors.sku}
        errorMessage={errors.sku?.message as string}
        testId="pro-sku"
      />

      {/* Price Fields */}
      <Box style={{ display: "flex", gap: "16px", alignItems: 'flex-end' }}>
        <InputField
          label="Sale Price"
          name="salePrice"
          type="number"
          register={register}
          placeholder="0.00"
          error={!!errors.salePrice}
          errorMessage={errors.salePrice?.message as string}
          testId="pro-saleprice"
        />

        <SelectField
          label="Discount Type"
          name="discountType"
          value={watch("discountType") || "PERCENTAGE"}
          register={register}
          options={discountTypeOptions}
          onChange={(e: SelectChangeEvent<string | number>) => {
            setValue("discountType", String(e.target.value), { shouldValidate: true });
          }}
          error={!!errors.discountType}
          errorMessage={errors.discountType?.message as string}
          testId="pro-distype"
        />

        <InputField
          label="Discount Value"
          name="discountValue"
          type="number"
          register={register}
          placeholder="0.00"
          error={!!errors.discountValue}
          errorMessage={errors.discountValue?.message as string}
          testId="pro-disvalue"
        />
      </Box>

      {/* Shop Selection */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
        <Typography variant="h6">Select Shop</Typography>
        <Button 
          variant="outlined" 
          onClick={() => {
            setOpenShopPopup(true);
            fetchShops();
          }}
        >
          Change Shop
        </Button>
      </Box>

      {/* Display selected shop */}
      {selectedShop && (
        <Box mt={2} display="flex" alignItems="center" justifyContent="flex-start">
          <Box m={1}>
            <ShopCard
              shopName={selectedShop.shopName}
              onClick={() => {}}
              showDelete={true}
              data-testid={`shop-card-${selectedShop.id}`}
              onDelete={handleRemoveShop}
            />
          </Box>
        </Box>
      )}

      {/* Categories */}
      <SearchSelect
        label="Categories"
        name="categories"
        register={register}
        value={watch("categoriesForm")?.map(category => ({
          label: category.name,
          value: category.id.toString()
        })) || []}
        onChange={(selectedOptions) => {
          const selectedCategories = selectedOptions.map((option) => ({
            id: Number(option.value),
            name: option.label
          }));
          setValue("categoriesForm", selectedCategories, { shouldValidate: true });
          setValue("categories", selectedCategories.map(c => c.id), { shouldValidate: true });
        }}
        placeholder="Search categories"
        error={!!errors.categories}
        errorMessage={errors.categories?.message as string}
        testId="categories"
        updateOptionData={handleUpdateCategoryData}
        fetchOptions={fetchCategories}
      />

      {/* Social Media Links Section */}
      <Typography variant="h6" style={{ marginTop: "24px", marginBottom: "16px" }}>
        Social Media Links
      </Typography>

      {watch("socialMediaLinks")?.map((link: any, index: number) => {
        if (link.operationName === 'REMOVE') return null;
        
        const getError = (field: 'platformType' | 'platformHandle') => {
            console.log(link.platformType,"PlatForm");
          const errorArray = errors.socialMediaLinks as unknown as Array<{
            platformType?: { message: string };
            platformHandle?: { message: string };
          }>;
          return {
            hasError: !!errorArray?.[index]?.[field],
            message: errorArray?.[index]?.[field]?.message || ''
          };
        };

        return (
          <Box 
            key={index} 
            style={{ 
              display: "flex", 
              gap: "16px", 
              marginBottom: "16px", 
              alignItems: 'flex-end' 
            }}
          >
            <SelectField
              label="Platform Type"
              name={`socialMediaLinks.${index}.platformType`}
              options={socialMediaOptions}
              value={link.platformType.toUpperCase() || ''}
              onChange={(e: SelectChangeEvent<string | number>) => {
                const value = e.target.value as string;
                handleSocialMediaLinkChange(index, 'platformType', value);
              }}
              error={getError('platformType').hasError}
              errorMessage={getError('platformType').message}
              testId={`social-platform-type-${index}`}
            />
            <InputField
              label={
                link.platformType 
                  ? `Enter ${link.platformType.charAt(0).toUpperCase() + link.platformType.slice(1)} Handle` 
                  : "Enter Platform Handle"
              }
              name={`socialMediaLinks[${index}].platformHandle`}
              register={register}
              value={link.platformHandle || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleSocialMediaLinkChange(index, 'platformHandle', e.target.value);
              }}
              placeholder={
                link.platformType === "whatsapp" 
                  ? "e.g. https://wa.me/1234567890" 
                  : link.platformType === "instagram" 
                  ? "e.g. @username" 
                  : link.platformType === "facebook" 
                  ? "e.g. https://facebook.com/username" 
                  : "Enter your handle or URL"
              }
              error={getError('platformHandle').hasError}
              errorMessage={getError('platformHandle').message}
              testId={`social-platform-handle-${index}`}
            />

            <Button 
              variant="outlined" 
              color="error"
              onClick={() => removeSocialMediaLink(index)}
              style={{ height: '56px' }}
              data-testid={`remove-social-link-${index}`}
            >
              Remove
            </Button>
          </Box>
        );
      })}

      <Button 
        variant="outlined" 
        onClick={addSocialMediaLink}
        style={{ marginTop: "8px" }}
        data-testid="add-social-link"
      >
        Add Social Media Link
      </Button>

      {/* Shop Selection Dialog */}
      <Dialog open={openShopPopup} onClose={() => setOpenShopPopup(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Select Shop
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenShopPopup(false)}
            aria-label="close"
            style={{
              position: "absolute",
              right: 16,
              top: 8,
              color: "#9e9e9e",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            Choose the shop for this product
          </Typography>
          <TextField
            name="shopSearch"
            variant="outlined"
            fullWidth
            placeholder="Search for a shop"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            error={false}
            style={{ marginBottom: "16px", width: "400px" }}
            value={shopSearchText}
            onChange={(e) => {
              setShopSearchText(e.target.value);
              fetchShops(e.target.value);
            }}
          />
          {/* Grid displaying fetched shops */}
          <Grid container spacing={2}>
            {loadingShops ? (
              <Typography>Loading shops...</Typography>
            ) : (
              shops.map((shop) => (
                <Grid item xs={12} sm={3} key={shop.id}>
                  <ShopCard 
                    shopName={shop.shopName} 
                    onClick={() => handleShopSelection(shop)} 
                  />
                </Grid>
              ))
            )}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Submit Button */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </Button>
      </Box>
    </form>
  );
};
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  CircularProgress,
  Switch,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Remove as RemoveIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import InputField from "../../components/common/inputs/InputField";
import TextAreaField from "../../components/common/inputs/TextAreaField";
import SelectField from "../../components/common/inputs/SelectField";
import SearchSelect from "../../components/common/SearchSelect/SearchSelect";

import {
  categoriesSearchRequest,
  fetchAllShopsRequest,
} from "../../services/shops/ShopRequest";
import { createProductRequest } from "../../services/products/ProductRequest";

import {
  IProductBasicInfo,
  ProductMutationCreateResponse,
  IProductMutationCreateVariables,
} from "../../interface/product.interface";
import {
  discountTypeOptions,
  socialMediaOptions,
} from "../../constant/products/options";

import { useAlert } from "../../utils/AlertBar";
import ShopCard from "../../components/common/ShopCard/ShopCard";
import { useProductFormContext } from "../../contexts/ProductContext";
import ImagesUpload from "../../components/ImagesUpload";
import Tabs from "../../components/common/Tabs";
import TabPanel from "../../components/common/TabPanel";

interface ShopNode {
  id: string;
  name: string;
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

// row structure for Manage Variants table
interface VariantRow {
  id: string;
  options: Record<string, string>;
  name: string;
  sku: string;
  price: string;
  active: boolean;
}

// Extra fields for product form
interface ProductFormValues extends IProductBasicInfo {
  tagline?: string;
  socialMediaLinks: Array<{
    platformType: string;
    platformHandle: string;
  }>;
  categoriesForm: Array<{
    id: number;
    name: string;
  }>;
}

export const ProductForm: React.FC<{ setActiveTab: (value: string) => void }> = ({
  setActiveTab,
}) => {
  const { formData, updateFormData }: any = useProductFormContext();
  const { showAlert } = useAlert();
  const [activeInnerTab, setActiveInnerTab] = useState<string>("basic");

  // ✅ Variant tab enable/disable – only true after "Proceed to add variants"
  const [variantTabEnabled, setVariantTabEnabled] = useState(false);

  const [openShopPopup, setOpenShopPopup] = useState(false);
  const [shopSearchText, setShopSearchText] = useState("");
  const [selectedShop, setSelectedShop] = useState<any>(formData?.shop || null);
  const [shops, setShops] = useState<any[]>([]);
  const [loadingShops, setLoadingShops] = useState(false);

  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [submitMode, setSubmitMode] = useState<"no-variants" | "add-variants">(
    "no-variants"
  );

  // Images
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // --------- Variant state ----------
  // start empty – Variant tab will be blank initially
  const [variantTypes, setVariantTypes] = useState<string[]>([]);
  const [variantTypeInput, setVariantTypeInput] = useState<string>("");

  // for each variant type -> list of values (chips)
  const [variantValues, setVariantValues] = useState<Record<string, string[]>>(
    {}
  );

  // text inside each value input (per type)
  const [variantValuesInput, setVariantValuesInput] =
    useState<Record<string, string>>({});

  // rows generated for Manage Variants table
  const [variantCombinations, setVariantCombinations] = useState<VariantRow[]>(
    []
  );

  // warnings / cautions
  const [variantWarningOpen, setVariantWarningOpen] = useState(false);
  const [variantWarningMessage, setVariantWarningMessage] = useState("");

  // ✅ store basic-info draft when user clicks "Proceed to add variants"
  const [basicInfoDraft, setBasicInfoDraft] =
    useState<ProductFormValues | null>(null);

  const methods = useForm<ProductFormValues>({
    defaultValues: {
      ...(formData.productData as any),
      socialMediaLinks: formData.productData.socialMediaLinks || [],
      categoriesForm:
        formData.productData.categories?.map((id: number) => ({
          id,
          name: "",
        })) || [],
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = methods;

  const { mutate: createProductMutate, isLoading: isSubmitting } = useMutation<
    ProductMutationCreateResponse,
    Error,
    IProductMutationCreateVariables
  >(createProductRequest);

  // ----------------- Categories -----------------
  const categories = getValues("categories") || [];

  const categoryOptions =
    watch("categoriesForm")?.map((category) => ({
      label: category.name,
      value: category.id.toString(),
    })) || [];

  const fetchCategories = async (searchText: string) => {
    try {
      const response = await categoriesSearchRequest(searchText);
      if (response.categoriesSearch.__typename === "CategoryQuerySuccess") {
        return (
          response.categoriesSearch.categories?.map((category: any) => ({
            label: category.name,
            value: category.id.toString(),
            rawValue: category,
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

  // ----------------- Shops (popup) -----------------
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

  const handleShopSelection = (shop: any) => {
    setSelectedShop(shop);
    setValue("shop", Number(shop.id), { shouldValidate: true });
    updateFormData({ shop: Number(shop.id) });
    setOpenShopPopup(false);
  };

  const handleRemoveShop = () => {
    setSelectedShop(null);
    setValue("shop", 0, { shouldValidate: true });
  };

  useEffect(() => {
    if (openShopPopup) {
      fetchShops(shopSearchText);
    }
  }, [openShopPopup, shopSearchText]);

  // ----------------- Social media links -----------------
  const socialMediaLinks = getValues("socialMediaLinks") || [];
  const discountType = watch("discountType");

  const addSocialMediaLink = () => {
    setValue(
      "socialMediaLinks",
      [...socialMediaLinks, { platformType: "", platformHandle: "" }],
      { shouldValidate: true }
    );
  };

  const removeSocialMediaLink = (index: number) => {
    const updatedLinks = socialMediaLinks.filter(
      (_: any, i: number) => i !== index
    );
    setValue("socialMediaLinks", updatedLinks, { shouldValidate: true });
  };

  // ----------------- VARIANT HELPERS -----------------

  // add new variant type (max 3)
  const handleAddVariantType = () => {
    const trimmed = variantTypeInput.trim();
    if (!trimmed) return;

    const alreadyExists = variantTypes.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setVariantWarningMessage(
        "You have already added this variant type. Please choose a different one."
      );
      setVariantWarningOpen(true);
      return;
    }

    if (variantTypes.length >= 3) {
      setVariantWarningMessage("Note: You cannot add more than 3 variant types.");
      setVariantWarningOpen(true);
      setVariantTypeInput("");
      return;
    }

    setVariantTypes((prev) => [...prev, trimmed]);
    setVariantValues((prev) => ({ ...prev, [trimmed]: [] }));
    setVariantTypeInput("");
  };

  const handleRemoveVariantType = (type: string) => {
    setVariantTypes((prev) => prev.filter((t) => t !== type));
    setVariantValues((prev) => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
    setVariantValuesInput((prev) => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
  };

  const handleVariantValueInputChange = (type: string, value: string) => {
    setVariantValuesInput((prev) => ({ ...prev, [type]: value }));
  };

  // add a value (chip) inside a variant type
  const handleAddVariantValue = (type: string) => {
    const raw = (variantValuesInput[type] || "").trim();
    if (!raw) return;

    setVariantValues((prev) => {
      const existing = prev[type] || [];
      if (existing.some((v) => v.toLowerCase() === raw.toLowerCase())) {
        return prev;
      }
      return { ...prev, [type]: [...existing, raw] };
    });

    setVariantValuesInput((prev) => ({ ...prev, [type]: "" }));
  };

  const handleRemoveVariantValue = (type: string, value: string) => {
    setVariantValues((prev) => {
      const existing = prev[type] || [];
      return { ...prev, [type]: existing.filter((v) => v !== value) };
    });
  };

  // handle Name/SKU/Price/Active toggle changes in table
  const handleVariantRowFieldChange = (
    rowId: string,
    field: "name" | "sku" | "price" | "active",
    value: string | boolean
  ) => {
    setVariantCombinations((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, [field]: value as any } : row
      )
    );
  };

  // regenerate table rows whenever values change
  useEffect(() => {
    const filledTypes = variantTypes.filter(
      (type) => (variantValues[type] || []).length > 0
    );

    if (filledTypes.length === 0) {
      setVariantCombinations([]);
      return;
    }

    let combos: Record<string, string>[] = [{}];

    filledTypes.forEach((type) => {
      const values = variantValues[type] || [];
      const newCombos: Record<string, string>[] = [];

      combos.forEach((base) => {
        values.forEach((val) => {
          newCombos.push({ ...base, [type]: val });
        });
      });

      combos = newCombos;
    });

    const rows: VariantRow[] = combos.map((combo, index) => ({
      id: `row-${index}-${filledTypes.map((t) => combo[t]).join("|")}`,
      options: combo,
      name: "",
      sku: "",
      price: "",
      active: true,
    }));

    setVariantCombinations(rows);
  }, [variantTypes, variantValues]);

  // ----------------- Submit formatting -----------------
  const formatProductCreateData = (productData: ProductFormValues) => ({
    productData: {
      title: productData.title,
      tagline: (productData as any).tagline,
      description: productData.description,
      sku: productData.sku,
      salePrice: productData.salePrice,
      discountType: productData.discountType,
      discountValue: productData.discountValue,
      shop: productData.shop,
      categories: productData.categories.map((c) => Number(c)),
      socialMediaLinks: productData.socialMediaLinks || [],
    },
  });

  // ✅ MAIN form submit – behaviour depends on which button clicked
  const onSubmit = (formValues: ProductFormValues) => {
    const productData = formatProductCreateData(formValues);

    // =====================================================
    // 1) CREATE PRODUCT WITHOUT VARIANTS
    // =====================================================
    if (submitMode === "no-variants") {
      try {
        localStorage.setItem("productBasicInfo", JSON.stringify(productData));
        showAlert("Product basic info saved successfully!", "success");
      } catch (e) {
        console.error("Error saving basic info to localStorage", e);
        showAlert("Basic info save failed", "error");
      }

      reset({
        title: "",
        tagline: "",
        description: "",
        sku: "",
        categories: [],
        categoriesForm: [],
        salePrice: 0,
        discountType: "",
        discountValue: 0,
        socialMediaLinks: [],
        shop: undefined,
      });

      updateFormData({ productData: {}, shop: null });
      setSelectedShop(null);
      setUploadedImages([]);
      setIsDiscountOpen(false);

      setVariantTabEnabled(false);
      setBasicInfoDraft(null);
      setVariantTypes([]);
      setVariantTypeInput("");
      setVariantValues({});
      setVariantValuesInput({});
      setVariantCombinations([]);
      setActiveInnerTab("basic");
      setSubmitMode("no-variants");

      return;
    }

    // =====================================================
    // 2) PROCEED TO ADD VARIANTS – draft save + tab open
    // =====================================================
    if (submitMode === "add-variants") {
      setBasicInfoDraft(formValues);              // raw formValues as draft
      updateFormData({ productData: formValues }); // context me bhi daal do
      setVariantTabEnabled(true);                 // Variant tab enable
      setActiveInnerTab("variant");               // Variant tab pe le jao
      showAlert("Basic info saved as draft. Now add variants.", "success");
    }
  };

  // ✅ Add Variant button – save BASIC INFO + VARIANT DATA to localStorage
  const handleCreateVariants = () => {
    if (!basicInfoDraft) {
      showAlert(
        "Basic Info is missing. Please fill the Basic Info tab first.",
        "error"
      );
      return;
    }

    const basicInfoPayload = formatProductCreateData(basicInfoDraft);

    const payload = {
      basicInfo: basicInfoPayload,
      variantTypes,
      variantValues,
      variantsTable: variantCombinations,
    };

    try {
      localStorage.setItem("productWithVariants", JSON.stringify(payload));
      showAlert("Variants added successfully with basic info!", "success");

      // reset variant UI
      setVariantTypes([]);
      setVariantTypeInput("");
      setVariantValues({});
      setVariantValuesInput({});
      setVariantCombinations([]);
      setBasicInfoDraft(null);
      setVariantTabEnabled(false);
      setActiveInnerTab("basic");
      // optional: go to view-all
      setActiveTab("view-all");
    } catch (e) {
      console.error("Error saving variants to localStorage", e);
      showAlert("Unable to save variants locally.", "error");
    }
  };

  // ===========================================================
  //                       UI / LAYOUT
  // ===========================================================

  // tabs list depends on variantTabEnabled
  const innerTabs = [
    { label: "Basic Info", value: "basic" },
    { label: "Variant", value: "variant", disabled: !variantTabEnabled },
  ];

  return (
    <Box sx={{}}>
      <Tabs
        tabs={innerTabs}
        activeTab={activeInnerTab}
        onTabChange={(v) => {
          if (v === "variant" && !variantTabEnabled) {
            return;
          }
          setActiveInnerTab(v);
        }}
      >
        {/* ---------------- BASIC INFO TAB ---------------- */}
        <TabPanel value="basic">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ maxWidth: 680, pb: 8 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 600 }}
                data-testid="basic-details-heading"
              >
                Basic Details
              </Typography>

              <InputField
                label="Name"
                name="title"
                register={register}
                required="Product name is required"
                placeholder="Enter Product Name"
                error={!!errors.title}
                errorMessage={errors.title?.message as string}
                testId="pro-title"
              />

              <InputField
                label="Tagline"
                name={"tagline" as any}
                register={register as any}
                placeholder="Provide a Tag Line"
                error={!!(errors as any).tagline}
                errorMessage={(errors as any).tagline?.message as string}
                testId="pro-tagline"
              />

              <TextAreaField
                label="Description"
                name="description"
                register={register}
                required="Product description is required"
                minLength={{
                  value: 10,
                  message: "Description must be at least 10 characters",
                }}
                placeholder="Provide brief description"
                error={!!errors.description}
                errorMessage={errors.description?.message as string}
                testId="pro-desc"
              />
              <Typography
                variant="caption"
                sx={{ display: "block", mt: -3, mb: 2 }}
                color="text.secondary"
              >
                Minimum length is 20–50 characters.
              </Typography>

              <InputField
                label="SKU"
                name="sku"
                register={register}
                placeholder="Enter Product SKU Value"
                error={!!errors.sku}
                errorMessage={errors.sku?.message as string}
                testId="pro-sku"
              />

              <SearchSelect
                label="Categories"
                name="categories"
                register={register}
                value={categoryOptions}
                onChange={(selectedOptions) => {
                  const selectedCategories = selectedOptions.map((option) => ({
                    id: Number(option.value),
                    name: option.label,
                  }));
                  setValue("categoriesForm", selectedCategories, {
                    shouldValidate: true,
                  });
                  setValue(
                    "categories",
                    selectedCategories.map((c) => c.id),
                    { shouldValidate: true }
                  );
                }}
                placeholder="Add Categories"
                error={!!errors.categories}
                errorMessage={errors.categories?.message as string}
                testId="categories"
                updateOptionData={handleUpdateCategoryData}
                fetchOptions={fetchCategories}
              />

              <ImagesUpload
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                metadata={{ contentType: "PRODUCT", mediaSubType: "CARD" }}
              />

              {/* Platforms – Social Media */}
              <Typography
                variant="subtitle1"
                sx={{ mt: 4, mb: 1, fontWeight: 600 }}
              >
                Platforms - Social Media
              </Typography>

              <Box sx={{ maxWidth: 480 }}>
                {socialMediaLinks.length === 0 ? (
                  <SelectField
                    label="Platform Name"
                    name="socialMediaLinks.0.platformType"
                    options={socialMediaOptions}
                    value=""
                    onChange={(e: SelectChangeEvent<string | number>) => {
                      const value = e.target.value as string;
                      setValue(
                        "socialMediaLinks",
                        [{ platformType: value, platformHandle: "" }],
                        { shouldValidate: true }
                      );
                    }}
                    error={!!errors.socialMediaLinks?.[0]?.platformType}
                    errorMessage={
                      (errors.socialMediaLinks?.[0] as any)?.platformType
                        ?.message || ""
                    }
                    testId="social-platform-type-0"
                  />
                ) : (
                  socialMediaLinks.map((link: any, index: number) => {
                    const getError = (
                      field: "platformType" | "platformHandle"
                    ) => {
                      const errorArray =
                        (errors.socialMediaLinks as unknown as Array<{
                          platformType?: { message: string };
                          platformHandle?: { message: string };
                        }>) || [];
                      return {
                        hasError: !!errorArray?.[index]?.[field],
                        message:
                          errorArray?.[index]?.[field]?.message || "",
                      };
                    };

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 2,
                          alignItems: "flex-end",
                        }}
                      >
                        <SelectField
                          label="Platform Name"
                          name={`socialMediaLinks.${index}.platformType`}
                          options={socialMediaOptions}
                          value={link.platformType || ""}
                          onChange={(e: SelectChangeEvent<string | number>) => {
                            const value = e.target.value as string;
                            setValue(
                              `socialMediaLinks.${index}`,
                              {
                                platformType: value,
                                platformHandle: link.platformHandle || "",
                              },
                              { shouldValidate: true }
                            );
                          }}
                          error={getError("platformType").hasError}
                          errorMessage={getError("platformType").message}
                          testId={`social-platform-type-${index}`}
                        />

                        <InputField
                          label={
                            link.platformType
                              ? `Enter ${
                                  link.platformType.charAt(0).toUpperCase() +
                                  link.platformType.slice(1)
                                } Handle`
                              : "Enter Platform Handle"
                          }
                          name={`socialMediaLinks[${index}].platformHandle`}
                          register={register}
                          value={link.platformHandle || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setValue(
                              `socialMediaLinks.${index}.platformHandle`,
                              e.target.value,
                              {
                                shouldValidate: true,
                              }
                            );
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
                          error={getError("platformHandle").hasError}
                          errorMessage={getError("platformHandle").message}
                          testId={`social-platform-handle-${index}`}
                        />

                        {index > 0 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => removeSocialMediaLink(index)}
                            sx={{ height: 56 }}
                            data-testid={`remove-social-link-${index}`}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>
                    );
                  })
                )}

                {socialMediaLinks.length > 0 && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={addSocialMediaLink}
                    sx={{ mt: 1, pl: 0 }}
                    startIcon={<AddIcon fontSize="small" />}
                    data-testid="add-social-link"
                  >
                    Add social media link
                  </Button>
                )}
              </Box>

              {/* Discounts – collapsible block */}
              <Box sx={{ mt: 4 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Discounts
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsDiscountOpen((prev) => !prev)}
                  >
                    {isDiscountOpen ? <RemoveIcon /> : <AddIcon />}
                  </IconButton>
                </Box>

                {isDiscountOpen && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
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
                      value={discountType || ""}
                      register={register}
                      options={discountTypeOptions}
                      onChange={(e: SelectChangeEvent<string | number>) => {
                        setValue("discountType", String(e.target.value), {
                          shouldValidate: true,
                        });
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
                )}
              </Box>
            </Box>

            {/* Footer buttons – figma style */}
            <Box
              sx={{
                mt: 2,
                pb: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={isSubmitting}
                onClick={() => setSubmitMode("no-variants")}
              >
                {isSubmitting ? "Creating..." : "Create Product without variants"}
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                onClick={() => setSubmitMode("add-variants")}
              >
                Proceed to add variants
              </Button>
            </Box>
          </form>

          {/* Shop dialog */}
          <Dialog
            open={openShopPopup}
            onClose={() => setOpenShopPopup(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              Select Shop
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenShopPopup(false)}
                aria-label="close"
                sx={{
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
              <Typography variant="body1" sx={{ mb: 2 }}>
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
                sx={{ mb: 2, width: 400 }}
                value={shopSearchText}
                onChange={(e) => setShopSearchText(e.target.value)}
              />
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

          {selectedShop && (
            <Box mt={2} display="flex" alignItems="center">
              <ShopCard
                shopName={selectedShop.shopName}
                onClick={() => {}}
                showDelete
                data-testid={`shop-card-${selectedShop.id}`}
                onDelete={handleRemoveShop}
              />
            </Box>
          )}
        </TabPanel>

        {/* ---------------- VARIANT TAB (FIGMA STYLE) ---------------- */}
        {variantTabEnabled && (
          <TabPanel value="variant">
            <Box sx={{ maxWidth: 900, pb: 8 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Variant
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                After you create the basic product, you can proceed to add variants
                here.
              </Typography>

              {/* Add Variant Types */}
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Add Variant Types
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label="Variant Types"
                  variant="outlined"
                  value={variantTypeInput}
                  onChange={(e) => setVariantTypeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddVariantType();
                    }
                  }}
                />
                <IconButton
                  sx={{
                    border: "1px solid #E0E0E0",
                    width: 36,
                    height: 36,
                  }}
                  onClick={handleAddVariantType}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* static note like figma: max 3 variant types */}
              <Box
                sx={{
                  mb: 3,
                  mt: 1,
                  bgcolor: "#FFF8E1",
                  borderRadius: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Typography variant="body2" sx={{ color: "#8D6E63" }}>
                  Note: You cannot add more than 3 variant types.
                </Typography>
              </Box>

              {/* Chips for types (Color, Size etc.) */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {variantTypes.map((type) => (
                  <Box
                    key={type}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 16,
                      border: "1px solid #D3D3D3",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 12,
                      bgcolor: "#F5F5F5",
                      gap: 0.5,
                    }}
                  >
                    <span>{type}</span>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveVariantType(type)}
                      sx={{
                        width: 18,
                        height: 18,
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              {/* Add Variant Values */}
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Add Variant Values
              </Typography>

              {variantTypes.map((type) => (
                <Box key={type} sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    {type}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      fullWidth
                      label={type}
                      placeholder={`Add ${type}`}
                      variant="outlined"
                      value={variantValuesInput[type] || ""}
                      onChange={(e) =>
                        handleVariantValueInputChange(type, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddVariantValue(type);
                        }
                      }}
                    />
                    <IconButton
                      sx={{
                        border: "1px solid #E0E0E0",
                        width: 36,
                        height: 36,
                      }}
                      onClick={() => handleAddVariantValue(type)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* chips for values under that type */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    {(variantValues[type] || []).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        onDelete={() => handleRemoveVariantValue(type, value)}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              {/* Manage Variants table */}
              {variantCombinations.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 4, mb: 1, fontWeight: 600 }}
                  >
                    Manage Variants
                  </Typography>

                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {variantTypes.map((type) => (
                          <TableCell key={type}>{type}</TableCell>
                        ))}
                        <TableCell>Name</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Media</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {variantCombinations.map((row) => (
                        <TableRow
                          key={row.id}
                          sx={(theme) =>
                            !row.active
                              ? {
                                  bgcolor: theme.palette.action.hover,          // light grey row
                                  '& td': {
                                    color: theme.palette.text.disabled,
                                  },
                                  '& .MuiInputBase-root': {
                                    color: theme.palette.text.disabled,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.action.disabledBackground,
                                  },
                                  '& .MuiSvgIcon-root': {
                                    color: theme.palette.action.disabled,
                                  },
                                }
                              : {}
                          }
                        >
                          {variantTypes.map((type) => (
                            <TableCell key={type}>
                              {row.options[type] || ""}
                            </TableCell>
                          ))}
                          <TableCell>
                            <TextField
                              variant="outlined"
                              disabled={!row.active}
                              size="small"
                              value={row.name}
                              onChange={(e) =>
                                handleVariantRowFieldChange(
                                  row.id,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="outlined"
                              disabled={!row.active}
                              size="small"
                              value={row.sku}
                              onChange={(e) =>
                                handleVariantRowFieldChange(
                                  row.id,
                                  "sku",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              variant="outlined"
                              disabled={!row.active}
                              size="small"
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                handleVariantRowFieldChange(
                                  row.id,
                                  "price",
                                  e.target.value
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton component="span" disabled={!row.active}>
                              <CloudUploadIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={row.active}
                              onChange={(e) =>
                                handleVariantRowFieldChange(
                                  row.id,
                                  "active",
                                  e.target.checked
                                )
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}

              {/* Footer buttons bottom right, like Figma */}
              <Box
                sx={{
                  mt: 4,
                  pb: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setVariantTabEnabled(false);
                    setActiveInnerTab("basic");
                  }}
                >
                  Skip
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateVariants}
                  disabled={variantTypes.length === 0}
                >
                  Add Variant
                </Button>
              </Box>
            </Box>
          </TabPanel>
        )}
      </Tabs>

      {/* Caution popup for variant types */}
      <Dialog
        open={variantWarningOpen}
        onClose={() => setVariantWarningOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            boxShadow: "none",
            background: "transparent",
          },
        }}
      >
        <Box
          sx={{
            border: "2px solid #1976d2",
            bgcolor: "#fff",
            p: 3,
            minWidth: 420,
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={() => setVariantWarningOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography
            variant="subtitle1"
            sx={{ mb: 1, fontWeight: 700, color: "error.main" }}
          >
            Caution !
          </Typography>

          <Typography variant="body2">
            {variantWarningMessage ||
              "You have already added two variant types, once you add the third variant type, you cannot able to edit it, but you can able to reset it entirely."}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

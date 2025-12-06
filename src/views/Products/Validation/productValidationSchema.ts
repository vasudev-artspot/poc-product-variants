export const ProductFormSchema: any = {
    type: "object",
    properties: {
      title: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Product name is required" },
      },
      description: {
        type: "string",
        minLength: 10,
        errorMessage: { minLength: "Product description is required" },
      },
      sku: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Product SKU is required" },
      },
      salePrice: {
        type: "string",
        minLength:1,
        errorMessage: { minLength: "Sale Price is required" },
      },
      categories: {
        minItems: 1,
        errorMessage: { minItems: "At least one category must be selected" },
      },
      shop: {
        minItems: 1,
        errorMessage: { minItems: "At least one shop must be selected" },
      },
      discountType: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Discount Type is required" },
      },
      discountValue: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Discount is required" },
      },
      platformType: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Platform Type is required" },
      },
      platformHandle: {
        type: "string",
        minLength: 1,
        errorMessage: { minLength: "Platform Handle is required" },
      },
      // productImages: {
      //   type: "array",
      //   items: { type: "string" },
      //   minItems: 1,
      //   errorMessage: {
      //     type: "Product images must be a list",
      //     minItems: "At least one image is required",
      //   },
      // },
      // tagLine: {
      //   type: "string",
      //   minLength: 1,
      //   errorMessage: { minLength: "Product tagline is required" },
      // },
      // platform: {
      //   type: "string",
      //   minLength: 1,
      //   errorMessage: { minLength: "Platform is required" },
      // },
      // discountCode: {
      //   type: "string",
      //   minLength: 1,
      //   errorMessage: { minLength: "Discount Code is required" },
      // },
      // startDate: {
      //   type: "string",
      //   format: "date",
      //   errorMessage: { format: "Start Date must be a valid date (YYYY-MM-DD)" },
      // },
      // endDate: {
      //   type: "string",
      //   format: "date",
      //   errorMessage: { format: "End Date must be a valid date (YYYY-MM-DD)" },
      // },
    },
    required: [
      "name",
      // "sku",
      "salePrice",
      "categories",
      "shop",
      // "description",
      "platformType",
      "platformHandle",
      "discountType",
      "discountValue",
    ],
  };
  
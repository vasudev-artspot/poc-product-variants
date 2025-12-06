export interface IProductBasicInfo {
    title: string;
    description: string;
    sku: string;
    salePrice: number;
    discountType: string;
    discountValue: number;
    shop: number;
    categories: number[];
    socialMediaLinks: ISocialMediaLink[];
}

export interface ISocialMediaLink {
    platformType: string;
    platformHandle: string;
}

export type ProductFormData = {
    productData: IProductBasicInfo;
};


export interface ProductFormContextType {
    formData: ProductFormData;
    updateFormData: (data: { [key: string]: any }) => void;
}
  
export interface ProductFormProviderProps {
    children: React.ReactNode;
}

export interface GraphQLVariables {
    [key: string]: any;
  }
  
export interface IProductMutationCreateVariables extends GraphQLVariables {
    // productInput: {
      productData: IProductBasicInfo;
    // };
}
  
export interface ProductMutationCreateResponse {
    data: any;
    createProduct: {
      errors: any;
      productCreateResult: {
        id: any;
        __typename: "ProductCreateMutation";
        code: number;
        message: string;
        product?: {
          id: string;
          title: string;
        };
        errors?: string[];
      };
    };
}

//Update

export interface IProductUpdateInput {
  id: number;
  title: string;
  description: string;
  sku: string;
  salePrice: number;
  discountType: string;
  discountValue: number;
  shop: number;
  categories: Array<{
    categoryId: number;
    operationName: 'ADD' | 'REMOVE' | 'NONE';
  }>;
  socialMediaLinks: Array<{
    // platformUrl: string;
    operationName: 'ADD' | 'REMOVE' | 'NONE';
    socialMediaPlatform: string;
}>;
}

export interface IProductMutationUpdateVariables extends GraphQLVariables {
  productUpdateInput: IProductUpdateInput;
}

  export interface ProductMutationUpdateResponse {
    data: any;
    updateProduct: {
      errors: any;
      productUpdateResult: {
        __typename: "ProductUpdateMutation";
        code: number;
        message: string;
        product?: {
          id: string;
          title: string;
        };
        errors?: string[];
      };
    };
  }
  
  // Delete

  export interface IProductMutationDeleteVariables extends GraphQLVariables {
    productDeleteInput: {
      id: number;
    };
  }
  
  export interface ProductMutationDeleteResponse {
    data: any;
    deleteProduct: {
      productDeleteResult: {
        __typename: "ProductDeleteMutation";
        code: number;
        message: string;
        errors?: string[];
      };
    };
  }
  
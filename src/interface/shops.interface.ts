import { ReactNode } from "react";

export interface IShopInfo {
  name: string;
  tagLine: string;
  contact: string;
  email: string;
  specialities: string;
  shopPolicies: string;
  shopCategories: string;
  shopThings: string;
}

export interface IHeadOfficeFormData {
  shoplocation: string;
  address1: string;
  address2: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  website: string;
}

export interface Ifaqs {
  question: string;
  answer: string;
  topic: string;
}

export interface Ipolicies {
  policyType: string;
  policyDays: string;
  policyContent: string;
}

export type ShopFormData = {
  shopInfo: IShopInfo;
  locations: IHeadOfficeFormData;
  faqs: Ifaqs;
  policies: Ipolicies;
};

export interface ShopFormContextType {
  formData: ShopFormData;
  updateFormData: (
    step: keyof ShopFormData,
    data: { [key: string]: any }
  ) => void;
}

export interface ShopFormProviderProps {
  children: ReactNode;
}
export interface IShopMutationCreateVariables {
  shopInput: {};
}
export interface ShopMutationCreateResponse {
  data: any;
  createShop: {
    shopCreateResult: {
      __typename: "ShopCreateMutation";
      code: number;
      message: string;
      shop?: {
        name: string;
      };
      errors?: string[];
    };
  };
}

export interface CategoriesSearchResponse {
  categoriesSearch: {
    __typename: "CategoryQuerySuccess" | "CategoryQueryError";
    code: number;
    message?: string;
    categories?: Category[];
  };
}

export interface Category {
  id: string;
  name: string;
}

export interface LocationsResponse {
  postalCodeLocationQuery: {
    __typename: "PostalCodeLocationQuerySuccess" | "PostalCodeLocationQueryError";
    code?: number;
    message?: string;
    location?: {
      city: string;
      country: string;
      state: string;
      identifier: number;
    };
  };
}

export type Location = {
  shoplocation: string;
  address1: string;
  address2: string;
  pincode: string;
  state: string;
  city: string;
  country: string;
  website?: string;
};

export interface PolicyData {
  id:number;
  policyType: string;
  policyDays: number;
  policyContent: string;
  policyNotes: string;
}

export interface AddPolicyProps {
  onSave: (policy: PolicyData) => void;
  onCancel: () => void;
  isPolicyEditing: boolean;
}

export interface FAQData {
  id:number,
  topic: string;
  question: string;
  answer: string;
}

export interface AddFAQProps {
  onSave: (faq: FAQData) => void;
  onCancel: () => void;
  isFaqEditing: boolean;
}

interface CategoryInput {
  categoryId: number;
  operationName: "CREATE" | "UPDATE" | "DELETE"; // Assuming possible operations
}

export interface ShopUpdateInput {
  id: number;
  name: string;
  country: string;
  code: string;
  aboutInfo: string;
  tagLine: string;
  currency: string;
  images: string[];
  media: string[];
  tags: string[];
  categories: CategoryInput[];
}

export interface ShopDetailUpdateInput {
  [key: string]: any;
  shopUpdateInput: ShopUpdateInput;
}

export interface ShopUpdateLocationInput {
  id: number;
  locations: Location[];
}

export interface ShopLocationDeleteInput {
  id: number;
}

export interface ShopCreateLocationInput {
  id: number;
  locations: Location[];
}

//FAQ

export interface ShopUpdateFaqInput {
  id:number;
  topic: string;
  question: string;
  answer: string;
}

export interface ShopCreateFAQInput {
  id:number;
  topic: string;
  question: string;
  answer: string;
}

export interface ShopDeleteFaqInput {
  id:number;
}

//Policy

export interface ShopUpdatePolicyInput {
  id:number;
  policyType: string;
  policyDays: number;
  policyContent: string;
}

export interface ShopCreatePolicyInput {
  id:number;
  policyType: string;
  policyDays: number;
  policyContent: string;
}

export interface ShopDeletePolicyInput {
  id:number;
}






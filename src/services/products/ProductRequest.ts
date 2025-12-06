import { request } from "graphql-request";
import { useQuery } from "react-query";
import { CONTENT_SERVICE_URL } from "../constants";
import { createProductQuery, fetchProductQuery, updateProductQuery, deleteProductQuery, fetchProductsByIdQuery } from "./ProductService";
import { IProductMutationCreateVariables, IProductMutationDeleteVariables, IProductMutationUpdateVariables, ProductMutationCreateResponse, ProductMutationDeleteResponse, ProductMutationUpdateResponse } from "../../interface/product.interface";
import { getCookie } from "../../utils/utils";
import { CONSTANTS } from "../../constant/constant";

const token = getCookie(CONSTANTS.TOKEN);
console.log('Current token:', token); // Add this to verify token exists

// Create Product Request
export const createProductRequest = async (
    variables: IProductMutationCreateVariables
): Promise<ProductMutationCreateResponse> => {
  console.log(">>>>><<<<<<", variables);
  return request<ProductMutationCreateResponse>(
    CONTENT_SERVICE_URL,
    createProductQuery,
    variables
  );
};

//Fetch All Products Request

export const fetchAllProductsRequest = async (searchTerm: string = ""): Promise<any> => {
  return request(
    CONTENT_SERVICE_URL,
    fetchProductQuery,
    { searchTerm },
    // { searchTerm: searchTerm || null },
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

//Fetch Products by ID

export const fetchProductByIdRequest = async (id: string): Promise<any> => {
  console.log('Attempting to fetch product with ID:', id);
  try {
    const result = await request(
      CONTENT_SERVICE_URL,
      fetchProductsByIdQuery,
      { id: parseInt(id) },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log('Fetch result:', result);
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Update Product Request
export const updateProductRequest = async (
  variables: IProductMutationUpdateVariables
): Promise<ProductMutationUpdateResponse> => {
  return request<ProductMutationUpdateResponse>(
    CONTENT_SERVICE_URL,
    updateProductQuery,
    variables,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};

// Delete Product Request
export const deleteProductRequest = async (
  variables: IProductMutationDeleteVariables
): Promise<ProductMutationDeleteResponse> => {
  console.log('Delete request payload:', variables);
  try {
    const response = await request<ProductMutationDeleteResponse>(
      CONTENT_SERVICE_URL,
      deleteProductQuery,
      variables,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    console.log('Delete response:', response); 
    return response;
  } catch (error) {
    console.error('Delete request error:', error);
    throw error;
  }
};
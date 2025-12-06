import { request } from "graphql-request";
import { useQuery } from "react-query";
import { CONTENT_SERVICE_URL } from "../constants";
import {
  fetchShopsQuery,
  categoriesSearchQuery,
  createShopQuery,
  locationQuery,
  fetchSingleShopQuery,
  updateShopQuery,
  updateShopLocationQuery,
  deleteShopLocationQuery,
  createShopLocationQuery,
  updateShopFaqQuery,
  deleteShopFaqQuery,
  createShopFaqQuery,
  updateShopPolicyQuery,
  deleteShopPolicyQuery,
  createShopPolicyQuery,
  fetchAllShopsQuery
} from "./ShopService";
import {
  CategoriesSearchResponse,
  LocationsResponse,
  ShopDetailUpdateInput,
  ShopMutationCreateResponse,
  ShopUpdateInput,
  ShopUpdateLocationInput,
  ShopLocationDeleteInput,
  ShopCreateLocationInput,
  ShopUpdateFaqInput,
  ShopDeleteFaqInput,
  ShopUpdatePolicyInput,
  ShopDeletePolicyInput,
  ShopCreatePolicyInput,
  ShopCreateFAQInput
} from "../../interface/shops.interface";
import { getCookie } from "../../utils/utils";
import { CONSTANTS } from "../../constant/constant";

const token = getCookie(CONSTANTS.TOKEN);

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


// TODO: Replace `any` with the appropriate type if defined

// list shop request
export const useFetchShopsRequest = () => {  
  return useQuery<any>("shops", () =>
    request<any>({
      url: CONTENT_SERVICE_URL,
      document: fetchShopsQuery,
      // variables: variables,
      requestHeaders: {authorization: `Bearer ${token}`},
    }).catch((error) => {
      console.error("Error fetching shops:", error);
      // Handle token expiration or authentication error here
    })
  );
};

// Fetch all shops request - New Version
export const fetchAllShopsRequest = async (
  searchTerm: string = "", 
  first: number = 10, 
  after: string | null = null
): Promise<AllShopsResponse> => {
  const variables = { searchTerm, first, after };

  return request(
    CONTENT_SERVICE_URL,
    fetchAllShopsQuery,
    variables
  );
};



// create shop request
export const createShopRequest = async (
  variables: any
): Promise<ShopMutationCreateResponse> => {
  return request<ShopMutationCreateResponse>(
    CONTENT_SERVICE_URL,
    createShopQuery,
    variables
  );
};

// category search requets
export const categoriesSearchRequest = async (
  searchText: string
): Promise<CategoriesSearchResponse> => {
  const variables = { searchText };

  return request<CategoriesSearchResponse>(
    CONTENT_SERVICE_URL,
    categoriesSearchQuery,
    variables
  );
};

// Location query request
export const locationRequest = async (
  postalCode: string
): Promise<LocationsResponse> => {
  const variables = { postalCode };
  try {
    const response = await request<LocationsResponse>(
      CONTENT_SERVICE_URL,
      locationQuery,
      variables
    );
    return response;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
};

// Fetch single Shop Request
export const fetchSingleShopRequest = async (
  shopId: number
): Promise<any> => {
  const variables = { shopId };
  try {
    const response = await request<any>(
      CONTENT_SERVICE_URL,
      fetchSingleShopQuery,
      variables
    );
    return response;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
};

// update shop request
export const updateShopRequest = async (
  shopUpdateInput: ShopUpdateInput
): Promise<any> => {
  try {
    const variables: ShopDetailUpdateInput = { shopUpdateInput };

    console.log("shopUpdateInput =>", variables, shopUpdateInput);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      updateShopQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
};

//update shop location request

export const updateShopLocationRequest = async (
  shopLocationUpdateInput: ShopUpdateLocationInput
): Promise<any> => {
  try {
    const variables = { shopLocationUpdateInput };

    console.log("shopLocationUpdateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      updateShopLocationQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating shop location:", error);
    throw error;
  }
};


//delete shop location request

export const deleteShopLocationRequest = async (
  shopLocationDeleteInput: ShopLocationDeleteInput
): Promise<any> => {
  try {
    const variables = { shopLocationDeleteInput };

    console.log("shopLocationDeleteInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      deleteShopLocationQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting shop location:", error);
    throw error;
  }
};


//create shop location request

export const createShopLocationRequest = async (
  shopLocationCreateInput: ShopCreateLocationInput
): Promise<any> => {
  try {
    const variables = { shopLocationCreateInput };

    console.log("shopLocationCreateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      createShopLocationQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating a shop location:", error);
    throw error;
  }
};

//FAQ

//update shop faq request

export const updateShopFaqRequest = async (
  shopFaqUpdateInput: ShopUpdateFaqInput
): Promise<any> => {
  try {
    const variables = { shopFaqUpdateInput };

    console.log("shopFaqUpdateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      updateShopFaqQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating shop FAQ:", error);
    throw error;
  }
};


//delete shop faq request

export const deleteShopFaqRequest = async (
  shopFaqDeleteInput: ShopDeleteFaqInput
): Promise<any> => {
  try {
    const variables = { shopFaqDeleteInput };

    console.log("shopFaqDeleteInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      deleteShopFaqQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting shop FAQ:", error);
    throw error;
  }
};


//create shop faq request

export const createShopFaqRequest = async (
  shopFAQCreateInput: ShopCreateFAQInput
): Promise<any> => {
  try {
    const variables = { shopFAQCreateInput };

    console.log("shopFAQCreateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      createShopFaqQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating a shop FAQ:", error);
    throw error;
  }
};


//Policy

//update shop policy request

export const updateShopPolicyRequest = async (
  shopPolicyUpdateInput: ShopUpdatePolicyInput
): Promise<any> => {
  try {
    const variables = { shopPolicyUpdateInput };

    console.log("shopPolicyUpdateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      updateShopPolicyQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating shop policy:", error);
    throw error;
  }
};


//delete shop policy request

export const deleteShopPolicyRequest = async (
  shopPolicyDeleteInput: ShopDeletePolicyInput
): Promise<any> => {
  try {
    const variables = { shopPolicyDeleteInput };

    console.log("shopPolicyDeleteInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      deleteShopPolicyQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error deleting shop policy:", error);
    throw error;
  }
};


//create shop policy request

export const createShopPolicyRequest = async (
  shopPolicyCreateInput: ShopCreatePolicyInput
): Promise<any> => {
  try {
    const variables = { shopPolicyCreateInput };

    console.log("shopPolicyCreateInput =>", variables);

    const response = await request<any>(
      CONTENT_SERVICE_URL,
      createShopPolicyQuery,
      variables,
      {
        authorization: `Bearer ${token}`,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating a shop policy:", error);
    throw error;
  }
};
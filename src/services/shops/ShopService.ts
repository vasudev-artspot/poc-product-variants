import { gql } from "@apollo/client";

// list shops query
export const fetchShopsQuery = gql`
query {
  allShops {
    name
    id
    contentshoplocationSet {
      locationName
      address {
        country
        addressLine1
      }
    }
  }
}`;

//New Version

export const fetchAllShopsQuery = gql`
  query allShops($searchTerm: String, $first: Int, $after: String) {
    allShops: shops(searchTerm: $searchTerm, first: $first, after: $after) {
      __typename
      ... on ShopAllNodesQuerySuccess {
        allShopNodesResult {
          edges {
            node {
              name
              id
            }
            cursor
          }
        }
      }
      ... on ShopAllNodesQueryError {
        code
        message
      }
    }
  }
`;


export const createShopQuery = gql`
  mutation createShop($shopInput: ShopInput!) {
    createShop(shopInput: $shopInput) {
      shopCreateResult {
        __typename
        ... on ShopMutationSuccess {
          message
          shop {
            name
          }
        }
        ... on ShopMutationError {
          code
          message
          errors
        }
      }
    }
  }
`;

export const categoriesSearchQuery = gql`
  query categories($searchText: String!) {
    categoriesSearch(searchText: $searchText) {
      ... on CategoryQueryError {
        code
        message
      }
      ... on CategoryQuerySuccess {
        __typename
        code
        categories {
          name
          id
        }
      }
    }
  }
`;

export const locationQuery = gql`
  query locations($postalCode: String!) {
    postalCodeLocationQuery(postalCode: $postalCode) {
      __typename
      ... on PostalCodeLocationQuerySuccess {
        code
        message
        location {
          identifier
          city
          state
          country
        }
      }
      ... on PostalCodeLocationQueryError {
        code
        message
      }
    }
  }
`;

export const fetchSingleShopQuery = gql`
  query shop($shopId: Int!) {
    shopById(shopId: $shopId) {
      ... on ShopDetailQuerySuccess {
        code
        message
        shopInfo {
          aboutInfo
          code
          currency
          id
          guid
          name
          tagLine
          tagsList
          shopBanner
          shopLogo
          contentshoppoliciesSet {
            id
            policyType
            policyContent
          }
          contentshopfaqSet {
            id
            answer
            question
            topic
          }
          contentshoplocationSet {
            id
            locationName
            address {
              id
              shopAddressName
              addressLine1
              addressLine2
              zipCode
              city
              state
              country
            }
          }
        }
      }

      ... on ShopDetailQueryError {
        code
        message
      }
    }
  }`

export const updateShopQuery = gql`
  mutation ShopMutation($shopUpdateInput: ShopDetailUpdateInput) {
  updateContentShopDetails(shopUpdateInput: $shopUpdateInput){
    shopUpdateResult {
      ... on ShopMutationSuccess {
        code
        message
        shop {
          name
          currency
          tagsList
        }
      }
      ... on ShopMutationError {
        code
        message
      }
    }
  }
}`

export const createShopLocationQuery = gql`
mutation createShopLocationMutation($shopLocationCreateInput: ShopLocationCreateInput){
  createContentShopLocation(shopLocationCreateInput: $shopLocationCreateInput){
    shopCreateLocationResult{
      __typename
      ...on ShopLocationCreateUpdateMutationSuccess {
        code
        location {
          id
          shop {
            id
          }
          locationName
          address{
            id
            country
            state
          }
        }
      }
      ... on ShopLocationCreateUpdateMutationError{
        code
        message
        errors
      }
    }
  }
}`


export const updateShopLocationQuery = gql`
mutation ShopMutation($shopLocationUpdateInput: ShopLocationUpdateInput) {
  updateContentShopLocation(shopLocationUpdateInput:$shopLocationUpdateInput){
   shopLocationUpdateResult{
    __typename
      ...on ShopLocationCreateUpdateMutationSuccess{
        code
        message
        location
				{
          locationName
          website
          socialMediaTags
          address {
            country
            city
          }
        }
      }
       ... on ShopLocationCreateUpdateMutationError {
        code
        message
      }
    }
  }
}`

export const deleteShopLocationQuery = gql`
mutation ShopMutation($shopLocationDeleteInput: ShopLocationDeleteInput) {
  deleteContentShopLocation(shopLocationDeleteInput: $shopLocationDeleteInput) {
    shopLocationDeleteResult {
      ... on ShopLocationDeleteMutationSuccess {
        code
      	message
        }
      ...on ShopLocationDeleteMutationError {
        code
        message
     	}
    }
  }
}`

//FAQ

export const updateShopFaqQuery = gql`
mutation ShopMutation($shopFAQUpdateInput: ShopFAQUpdateInput) {
  updateContentShopFaq(shopFAQUpdateInput:$shopFAQUpdateInput){
    shopFAQUpdateResult {
      ...on ShopFAQCreateUpdateMutationSuccess{
        code
        faq{
          answer
          question
          topic
        }
      }
    }
  }
}`

export const createShopFaqQuery = gql`
mutation createShopFAQMutation($shopFAQCreateInput: ShopFAQCreateInput) {
  createContentShopFaq(shopFAQCreateInput: $shopFAQCreateInput) {
    shopCreateFAQResult {
      __typename
      ... on ShopFAQCreateUpdateMutationSuccess {
        code
        faq {
          id
         	 shop {
            id
          }
          question
          answer
   				topic
          
          }
        }
      ... on ShopFAQCreateUpdateMutationError {
        code
        message
        errors
      }
    }
  }
}`

export const deleteShopFaqQuery = gql`
mutation ShopMutation($shopFAQDeleteInput: ShopFAQDeleteInput) {
  deleteContentShopFaqs(shopFAQDeleteInput: $shopFAQDeleteInput) {
    shopFAQDeleteResult {
      ... on ShopFAQDeleteMutationSuccess {
        code
      	message
        }
      ...on ShopFAQDeleteMutationError {
        code
        message
     	 }
      }
    }
  }`


//Policy

export const updateShopPolicyQuery = gql`
mutation ShopMutation($shopPolicyUpdateInput: ShopPolicyUpdateInput) {
  updateContentShopPolicy(shopPolicyUpdateInput: $shopPolicyUpdateInput) {
    shopPolicyUpdateResult {
      ... on ShopPolicyCreateUpdateMutationSuccess {
        code
        policy {
          id
          policyType
          policyNotes
          policyDaysLimit
        }
      }
    }
  }
}`

export const createShopPolicyQuery = gql`
mutation createShopPolicyMutation($shopPolicyCreateInput: ShopPolicyCreateInput) {
  createContentShopPolicy(shopPolicyCreateInput: $shopPolicyCreateInput) {
    shopCreatePolicyResult {
      __typename
      ... on ShopPolicyCreateUpdateMutationSuccess {
        code
        policy {
          id
         	 shop {
            id
          }
          policyType
          policyNotes
          policyContent
          policyDaysLimit
          }
        }
      
      ... on ShopPolicyCreateUpdateMutationError {
        code
        message
        errors
      }
    }
  }
}`

export const deleteShopPolicyQuery = gql`
mutation ShopMutation($shopPolicyDeleteInput: ShopPolicyDeleteInput) {
  deleteContentShopPolicy(shopPolicyDeleteInput: $shopPolicyDeleteInput) {
    shopPolicyDeleteResult {
      ... on ShopPolicyDeleteMutationSuccess {
        code
        message
      }
      ... on ShopPolicyDeleteMutationError {
        code
        message
      }
    }
  }
}`

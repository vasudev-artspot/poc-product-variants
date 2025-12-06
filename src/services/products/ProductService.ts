import { gql } from "@apollo/client";

//Create Product Query

export const createProductQuery = gql`
  mutation createProd($productData: ProductInput) {
  createProduct(productInput: $productData) {
    productCreateResult {
      __typename
      ... on ProductMutationSuccess {
        product {
          title
          description
          salePrice
        }
        
      }
      ... on ProductMutationError{
        code
        message        
        errors
      }
    }
  }
}`;

//Update Product Query

export const updateProductQuery = gql`
  mutation updateProd($productUpdateInput: ProductUpdateInput) {
  updateProduct(productUpdateInput: $productUpdateInput) {
    productUpdateResult {
      ... on ProductMutationSuccess {
        product {
          title
          description
          salePrice
        }
      }
      
      ... on ProductMutationError{
        errors
        code
      }
    }
  }
}`;

//Delete Product Query

export const deleteProductQuery = gql`
mutation deleteProd($productDeleteInput: ProductDeleteInput){
  deleteProduct(productDeleteInput : $productDeleteInput){
    productDeleteResult{
     ... on ProductDeleteMutationSuccess{
      	code
    }
      ... on ProductMutationError{
        code
        message
      }
    }
  }
}`


//Fetch all Products query

export const fetchProductQuery = gql`
query products($searchTerm: String) {
  products(searchTerm: $searchTerm) {
    ... on ProductAllNodesQuerySuccess {
      productNodes {
        products(first:20) {
          totalCount
          edges {
            cursor
            node {
              title
            }
          }
        }
      }
    }
  }
}`

//Fetch Products by ID Query

export const fetchProductsByIdQuery = gql`
query products($id: Int) {
  productById(id: $id) {
    ... on ProductNodeQuerySuccess {
      productsNodeResult {
        id
        title
        description
        sku
        salePrice
        discountType
        discountValue
        shop
        { name
          id
        }
        categories{
          id
          name
        }
        socialMediaLinks{
          platformName
          platformUrl
        }
      }
    }
  }
}`
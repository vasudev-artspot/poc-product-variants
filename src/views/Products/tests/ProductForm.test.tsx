import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductForm } from '../ProductForm';
import { ProductEditForm } from '../Edit/ProductEditForm';
import { ProductFormProvider } from '../../../contexts/ProductContext';

// Mock the API functions
jest.mock('../../../services/products/ProductRequest', () => ({
  createProductRequest: jest.fn(),
  updateProductRequest: jest.fn(),
  fetchProductByIdRequest: jest.fn()
}));

jest.mock('../../../services/shops/ShopRequest', () => ({
  fetchAllShopsRequest: jest.fn(),
  categoriesSearchRequest: jest.fn()
}));

import { 
  createProductRequest, 
  updateProductRequest,
  fetchProductByIdRequest 
} from '../../../services/products/ProductRequest';
import { 
  fetchAllShopsRequest,
  categoriesSearchRequest 
} from '../../../services/shops/ShopRequest';

describe('Product Form End-to-End Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful responses
    (createProductRequest as jest.Mock).mockResolvedValue({
      createProduct: {
        productCreateResult: {
          product: {
            id: '123',
            title: 'Test Product',
            description: 'Test Description',
            sku: 'TEST123',
            salePrice: 99.99,
            discountType: 'PERCENTAGE',
            discountValue: 10,
            shop: { id: '1', name: 'Test Shop' },
            categories: [{ id: 1, name: 'Electronics' }],
            socialMediaLinks: [
              { platformName: 'INSTAGRAM', platformUrl: '@testuser' }
            ]
          }
        }
      }
    });

    (fetchProductByIdRequest as jest.Mock).mockResolvedValue({
      productById: {
        productsNodeResult: {
          id: '123',
          title: 'Test Product',
          description: 'Test Description',
          sku: 'TEST123',
          salePrice: 99.99,
          discountType: 'PERCENTAGE',
          discountValue: 10,
          shop: { id: '1', name: 'Test Shop' },
          categories: [{ id: 1, name: 'Electronics' }],
          socialMediaLinks: [
            { platformName: 'INSTAGRAM', platformUrl: '@testuser' }
          ]
        }
      }
    });

    (updateProductRequest as jest.Mock).mockResolvedValue({
      updateProduct: {
        productUpdateResult: {
          product: {
            id: '123',
            title: 'Updated Product',
            description: 'Updated Description',
            sku: 'UPDATED123',
            salePrice: 89.99,
            discountType: 'FIXED',
            discountValue: 5,
            shop: { id: '2', name: 'Updated Shop' },
            categories: [{ id: 2, name: 'Updated Category' }],
            socialMediaLinks: [
              { platformName: 'FACEBOOK', platformUrl: 'https://facebook.com/updated' }
            ]
          }
        }
      }
    });

    (fetchAllShopsRequest as jest.Mock).mockImplementation((searchTerm = '') => {
      const shops = [
        { id: '1', name: 'Test Shop' },
        { id: '2', name: 'Updated Shop' },
        ...(searchTerm ? [{ id: '3', name: `${searchTerm} Shop` }] : [])
      ];
      
      return Promise.resolve({
        allShops: {
          __typename: "ShopAllNodesQuerySuccess",
          allShopNodesResult: {
            edges: shops.map(shop => ({ node: shop }))
          }
        }
      });
    });

    (categoriesSearchRequest as jest.Mock).mockResolvedValue({
      categoriesSearch: {
        __typename: "CategoryQuerySuccess",
        categories: [
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Updated Category' },
          { id: 3, name: 'New Category' }
        ]
      }
    });
  });

  test('should successfully create and then edit a product', async () => {
    const setActiveTab = jest.fn();
    
    // Render and test create form
    const { rerender } = render(
      <ProductFormProvider>
        <ProductForm setActiveTab={setActiveTab} />
      </ProductFormProvider>
    );

    // Fill in product basic info
    const titleInput = screen.getByTestId('pro-title').querySelector('input')!;
    const descriptionInput = screen.getByTestId('pro-desc').querySelector('textarea')!;
    const skuInput = screen.getByTestId('pro-sku').querySelector('input')!;
    const salePriceInput = screen.getByTestId('pro-saleprice').querySelector('input')!;
    
    await userEvent.type(titleInput, 'Test Product');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(skuInput, 'TEST123');
    await userEvent.type(salePriceInput, '99.99');

    // Select discount type and value
    const discountTypeSelect = screen.getByTestId('pro-distype').querySelector('input')!;
    fireEvent.mouseDown(discountTypeSelect);
    const discountTypeOption = await screen.findByText('Percentage');
    await userEvent.click(discountTypeOption);
    
    const discountValueInput = screen.getByTestId('pro-disvalue').querySelector('input')!;
    await userEvent.type(discountValueInput, '10');

    // Select a shop
    const addShopButton = screen.getByLabelText('add-shop');
    await userEvent.click(addShopButton);
    
    await waitFor(() => {
      expect(screen.getByText('Select Shop')).toBeInTheDocument();
    });
    
    const shopSearchInput = screen.getByPlaceholderText('Search for a shop');
    await userEvent.type(shopSearchInput, 'Test');
    
    await waitFor(() => {
      expect(screen.getByText('Test Shop')).toBeInTheDocument();
    });
    
    const testShopCard = screen.getByText('Test Shop').closest('div[role="button"]')!;
    await userEvent.click(testShopCard);

    // Select categories
    const categoriesSelect = screen.getByTestId('categories').querySelector('input')!;
    fireEvent.mouseDown(categoriesSelect);
    
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });
    
    const electronicsOption = screen.getByText('Electronics');
    await userEvent.click(electronicsOption);
    
    // Add social media link
    const addSocialLinkButton = screen.getByTestId('add-social-link');
    await userEvent.click(addSocialLinkButton);
    
    const platformTypeSelect = screen.getByTestId('social-platform-type-0').querySelector('input')!;
    fireEvent.mouseDown(platformTypeSelect);
    
    await waitFor(() => {
      expect(screen.getByText('Instagram')).toBeInTheDocument();
    });
    
    const instagramOption = screen.getByText('Instagram');
    await userEvent.click(instagramOption);
    
    const platformHandleInput = screen.getByTestId('social-platform-handle-0').querySelector('input')!;
    await userEvent.type(platformHandleInput, '@testuser');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create product/i });
    await userEvent.click(submitButton);

    // Verify successful creation
    await waitFor(() => {
      expect(createProductRequest).toHaveBeenCalled();
      expect(setActiveTab).toHaveBeenCalledWith('view-all');
    });

    // Now test the edit flow
    rerender(
      <ProductFormProvider>
        <ProductEditForm productId="123" />
      </ProductFormProvider>
    );

    // Wait for form to load with existing data
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    });

    // Update product info
    const editTitleInput = screen.getByTestId('pro-title').querySelector('input')!;
    await userEvent.clear(editTitleInput);
    await userEvent.type(editTitleInput, 'Updated Product');

    const editDescriptionInput = screen.getByTestId('pro-desc').querySelector('textarea')!;
    await userEvent.clear(editDescriptionInput);
    await userEvent.type(editDescriptionInput, 'Updated Description');

    // Change shop
    const changeShopButton = screen.getByText('Change Shop');
    await userEvent.click(changeShopButton);
    
    await waitFor(() => {
      expect(screen.getByText('Select Shop')).toBeInTheDocument();
    });
    
    const editShopSearchInput = screen.getByPlaceholderText('Search for a shop');
    await userEvent.type(editShopSearchInput, 'Updated');
    
    await waitFor(() => {
      expect(screen.getByText('Updated Shop')).toBeInTheDocument();
    });
    
    const updatedShopCard = screen.getByText('Updated Shop').closest('div[role="button"]')!;
    await userEvent.click(updatedShopCard);

    // Update categories
    const editCategoriesSelect = screen.getByTestId('categories').querySelector('input')!;
    fireEvent.mouseDown(editCategoriesSelect);
    
    // Remove existing category
    const electronicsChip = screen.getByText('Electronics');
    const deleteIcon = within(electronicsChip.parentElement!).getByTestId('CancelIcon');
    await userEvent.click(deleteIcon);
    
    // Add new category
    fireEvent.mouseDown(editCategoriesSelect);
    await waitFor(() => {
      expect(screen.getByText('Updated Category')).toBeInTheDocument();
    });
    const updatedCategoryOption = screen.getByText('Updated Category');
    await userEvent.click(updatedCategoryOption);

    // Update social media link
    const existingPlatformType = screen.getByTestId('social-platform-type-0').querySelector('input')!;
    fireEvent.mouseDown(existingPlatformType);
    
    await waitFor(() => {
      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });
    
    const facebookOption = screen.getByText('Facebook');
    await userEvent.click(facebookOption);
    
    const existingPlatformHandle = screen.getByTestId('social-platform-handle-0').querySelector('input')!;
    await userEvent.clear(existingPlatformHandle);
    await userEvent.type(existingPlatformHandle, 'https://facebook.com/updated');

    // Add another social media link
    const addAnotherSocialLinkButton = screen.getByTestId('add-social-link');
    await userEvent.click(addAnotherSocialLinkButton);
    
    const newPlatformTypeSelect = screen.getByTestId('social-platform-type-1').querySelector('input')!;
    fireEvent.mouseDown(newPlatformTypeSelect);
    
    await waitFor(() => {
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });
    
    const whatsappOption = screen.getByText('WhatsApp');
    await userEvent.click(whatsappOption);
    
    const newPlatformHandleInput = screen.getByTestId('social-platform-handle-1').querySelector('input')!;
    await userEvent.type(newPlatformHandleInput, 'https://wa.me/1234567890');

    // Submit the update
    const updateButton = screen.getByRole('button', { name: /update product/i });
    await userEvent.click(updateButton);

    // Verify successful update
    await waitFor(() => {
      expect(updateProductRequest).toHaveBeenCalled();
    });
  });

  test('should show validation errors for required fields', async () => {
    const setActiveTab = jest.fn();
    
    render(
      <ProductFormProvider>
        <ProductForm setActiveTab={setActiveTab} />
      </ProductFormProvider>
    );

    const submitButton = screen.getByRole('button', { name: /create product/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Product title is required')).toBeInTheDocument();
      expect(screen.getByText('Product description is required')).toBeInTheDocument();
    });
  });

  test('should handle API errors during creation', async () => {
    (createProductRequest as jest.Mock).mockRejectedValueOnce({
      message: "Internal server error"
    });

    const setActiveTab = jest.fn();
    
    render(
      <ProductFormProvider>
        <ProductForm setActiveTab={setActiveTab} />
      </ProductFormProvider>
    );

    // Fill in minimal required fields
    const titleInput = screen.getByTestId('pro-title').querySelector('input')!;
    const descriptionInput = screen.getByTestId('pro-desc').querySelector('textarea')!;
    
    await userEvent.type(titleInput, 'Test Product');
    await userEvent.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /create product/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create product/i)).toBeInTheDocument();
    });
  });
});
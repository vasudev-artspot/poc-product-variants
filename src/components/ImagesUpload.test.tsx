// src/components/ImagesUpload.test.tsx

jest.mock('react-dropzone', () => ({
  __esModule: true,
  useDropzone: jest.fn(),
}));

import { useDropzone } from 'react-dropzone';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ImagesUpload from './ImagesUpload';

jest.mock('../services/file/FileUpload', () => ({
  uploadFiles: jest.fn(),
  deleteFile: jest.fn(),
}));

const mockUploadFiles = require('../services/file/FileUpload').uploadFiles;
const mockDeleteFile = require('../services/file/FileUpload').deleteFile;

describe('ImagesUpload Component', () => {
  const setUploadedImagesMock = jest.fn();
  const sampleFile = new File(['dummy content'], 'sample.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload UI correctly', () => {
    (useDropzone as jest.Mock).mockImplementation(() => ({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
    }));

    render(
      <ImagesUpload uploadedImages={[]} setUploadedImages={setUploadedImagesMock} />
    );

    expect(screen.getByText(/Drag and drop/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats/i)).toBeInTheDocument();
    expect(screen.getByText(/Attached File/i)).toBeInTheDocument();
  });

  test('handles successful image upload', async () => {
    let onDrop: any;
    (useDropzone as jest.Mock).mockImplementation(({ onDrop: dropFn }) => {
      onDrop = dropFn;
      return {
        getRootProps: () => ({}),
        getInputProps: () => ({}),
      };
    });

    const mockResponse = JSON.stringify(
      JSON.stringify({
        'sample.png': {
          success: true,
          fileName: 'uploaded-sample.png',
        },
      })
    );

    mockUploadFiles.mockResolvedValue({
      code: 200,
      result: [mockResponse],
    });

    render(
      <ImagesUpload uploadedImages={[]} setUploadedImages={setUploadedImagesMock} />
    );

    await act(async () => {
      await onDrop([sampleFile]);
    });

    await waitFor(() => {
      expect(setUploadedImagesMock).toHaveBeenCalled();
      expect(screen.getByText(/Image\(s\) uploaded successfully!/i)).toBeInTheDocument();
    });
  });

  test('handles upload failure', async () => {
    let onDrop: any;
    (useDropzone as jest.Mock).mockImplementation(({ onDrop: dropFn }) => {
      onDrop = dropFn;
      return {
        getRootProps: () => ({}),
        getInputProps: () => ({}),
      };
    });

    const mockFailure = JSON.stringify(
      JSON.stringify({
        'sample.png': {
          success: false,
          fileName: 'failed-sample.png',
        },
      })
    );

    mockUploadFiles.mockResolvedValue({
      code: 200,
      result: [mockFailure],
    });

    render(
      <ImagesUpload uploadedImages={[]} setUploadedImages={setUploadedImagesMock} />
    );

    await act(async () => {
      await onDrop([sampleFile]);
    });

    await waitFor(() => {
      expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
    });
  });

  test('deletes uploaded image successfully', async () => {
    mockDeleteFile.mockResolvedValue({ code: 200, success: true });

    const uploadedImage = {
      key: 'uploaded-sample.png-123',
      originalFileName: 'sample.png',
      fileName: 'uploaded-sample.png',
      size: 1024,
      previewUrl: 'http://dummy-url.com/uploaded-sample.png',
    };

    (useDropzone as jest.Mock).mockImplementation(() => ({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
    }));

    render(
      <ImagesUpload
        uploadedImages={[uploadedImage]}
        setUploadedImages={setUploadedImagesMock}
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteFile).toHaveBeenCalledWith('uploaded-sample.png');
      expect(setUploadedImagesMock).toHaveBeenCalled();
    });
  });
});

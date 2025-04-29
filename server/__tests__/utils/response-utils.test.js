import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  sendSuccessResponse,
  sendErrorResponse,
  handleAndSendError
} from '../../utils/response-utils.js';

describe('Response Utilities', () => {
  describe('createSuccessResponse', () => {
    test('creates a properly formatted success response', () => {
      const data = { id: 1, name: 'Test' };
      const response = createSuccessResponse(data);
      
      expect(response).toEqual({
        success: true,
        data,
        timestamp: expect.any(String),
        status: 200
      });
      
      // Verify timestamp is a valid ISO string
      expect(() => new Date(response.timestamp)).not.toThrow();
    });
    
    test('works with custom status code', () => {
      const data = { id: 1, name: 'Test' };
      const response = createSuccessResponse(data, 201);
      
      expect(response).toEqual({
        success: true,
        data,
        timestamp: expect.any(String),
        status: 201
      });
    });
    
    test('works with null data', () => {
      const response = createSuccessResponse();
      
      expect(response).toEqual({
        success: true,
        data: null,
        timestamp: expect.any(String),
        status: 200
      });
    });
  });
  
  describe('createErrorResponse', () => {
    test('creates a properly formatted error response', () => {
      const error = 'Something went wrong';
      const response = createErrorResponse(error);
      
      expect(response).toEqual({
        success: false,
        error,
        timestamp: expect.any(String),
        status: 400
      });
      
      // Verify timestamp is a valid ISO string
      expect(() => new Date(response.timestamp)).not.toThrow();
    });
    
    test('works with custom status code', () => {
      const error = 'Not found';
      const response = createErrorResponse(error, 404);
      
      expect(response).toEqual({
        success: false,
        error,
        timestamp: expect.any(String),
        status: 404
      });
    });
  });
  
  describe('handleApiError', () => {
    test('handles Error objects', () => {
      const error = new Error('Test error');
      const response = handleApiError(error);
      
      expect(response).toEqual({
        success: false,
        error: 'Test error',
        timestamp: expect.any(String),
        status: 500
      });
    });
    
    test('handles errors without message', () => {
      const error = new Error();
      const response = handleApiError(error);
      
      expect(response).toEqual({
        success: false,
        error: 'An unexpected error occurred',
        timestamp: expect.any(String),
        status: 500
      });
    });
    
    test('works with custom status code', () => {
      const error = new Error('Not found');
      const response = handleApiError(error, 404);
      
      expect(response).toEqual({
        success: false,
        error: 'Not found',
        timestamp: expect.any(String),
        status: 404
      });
    });
    
    test('logs the error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      
      handleApiError(error);
      
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', error);
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('sendSuccessResponse', () => {
    test('sends a success response with the correct status code', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const data = { id: 1, name: 'Test' };
      
      sendSuccessResponse(res, data, 201);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data,
        timestamp: expect.any(String),
        status: 201
      });
    });
  });
  
  describe('sendErrorResponse', () => {
    test('sends an error response with the correct status code', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const error = 'Not found';
      
      sendErrorResponse(res, error, 404);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error,
        timestamp: expect.any(String),
        status: 404
      });
    });
  });
  
  describe('handleAndSendError', () => {
    test('handles an error and sends a response with the correct status code', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const error = new Error('Test error');
      
      handleAndSendError(res, error, 500);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error',
        timestamp: expect.any(String),
        status: 500
      });
    });
    
    test('logs the error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      const error = new Error('Test error');
      
      handleAndSendError(res, error);
      
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', error);
      
      consoleSpy.mockRestore();
    });
  });
});

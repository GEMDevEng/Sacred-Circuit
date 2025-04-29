import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError
} from '../../utils/api-response';

describe('API Response Utilities', () => {
  describe('createSuccessResponse', () => {
    it('creates a properly formatted success response', () => {
      const data = { id: 1, name: 'Test' };
      const response = createSuccessResponse(data);
      
      expect(response).toEqual({
        success: true,
        data,
        timestamp: expect.any(String)
      });
      
      // Verify timestamp is a valid ISO string
      expect(() => new Date(response.timestamp)).not.toThrow();
    });
    
    it('works with different data types', () => {
      expect(createSuccessResponse('string')).toEqual({
        success: true,
        data: 'string',
        timestamp: expect.any(String)
      });
      
      expect(createSuccessResponse(123)).toEqual({
        success: true,
        data: 123,
        timestamp: expect.any(String)
      });
      
      expect(createSuccessResponse(null)).toEqual({
        success: true,
        data: null,
        timestamp: expect.any(String)
      });
      
      expect(createSuccessResponse([])).toEqual({
        success: true,
        data: [],
        timestamp: expect.any(String)
      });
    });
  });
  
  describe('createErrorResponse', () => {
    it('creates a properly formatted error response', () => {
      const error = 'Something went wrong';
      const response = createErrorResponse(error);
      
      expect(response).toEqual({
        success: false,
        error,
        timestamp: expect.any(String)
      });
      
      // Verify timestamp is a valid ISO string
      expect(() => new Date(response.timestamp)).not.toThrow();
    });
  });
  
  describe('handleApiError', () => {
    it('handles Error objects', () => {
      const error = new Error('Test error');
      const response = handleApiError(error);
      
      expect(response).toEqual({
        success: false,
        error: 'Test error',
        timestamp: expect.any(String)
      });
    });
    
    it('handles string errors', () => {
      const response = handleApiError('String error');
      
      expect(response).toEqual({
        success: false,
        error: 'An unknown error occurred',
        timestamp: expect.any(String)
      });
    });
    
    it('handles null or undefined errors', () => {
      expect(handleApiError(null)).toEqual({
        success: false,
        error: 'An unknown error occurred',
        timestamp: expect.any(String)
      });
      
      expect(handleApiError(undefined)).toEqual({
        success: false,
        error: 'An unknown error occurred',
        timestamp: expect.any(String)
      });
    });
    
    it('logs the error to console', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      
      handleApiError(error);
      
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', error);
      
      consoleSpy.mockRestore();
    });
  });
});

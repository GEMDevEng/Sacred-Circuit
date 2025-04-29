import { validateRequest, chatRequestSchema, reflectionRequestSchema, webhookRequestSchema } from '../../middleware/validation.js';
import { validateSchema } from '../../utils/validators.js';
import { sendErrorResponse } from '../../utils/response-utils.js';

// Mock dependencies
jest.mock('../../utils/validators.js', () => ({
  validateSchema: jest.fn()
}));

jest.mock('../../utils/response-utils.js', () => ({
  sendErrorResponse: jest.fn()
}));

describe('Validation Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('validateRequest', () => {
    test('calls next() when validation passes', () => {
      // Mock validation success
      validateSchema.mockReturnValue({ isValid: true, errors: [] });
      
      const middleware = validateRequest({ required: ['test'] });
      middleware(req, res, next);
      
      expect(validateSchema).toHaveBeenCalledWith(req.body, { required: ['test'] });
      expect(next).toHaveBeenCalled();
      expect(sendErrorResponse).not.toHaveBeenCalled();
    });
    
    test('sends error response when validation fails', () => {
      // Mock validation failure
      validateSchema.mockReturnValue({ 
        isValid: false, 
        errors: ['test is required'] 
      });
      
      const middleware = validateRequest({ required: ['test'] });
      middleware(req, res, next);
      
      expect(validateSchema).toHaveBeenCalledWith(req.body, { required: ['test'] });
      expect(next).not.toHaveBeenCalled();
      expect(sendErrorResponse).toHaveBeenCalledWith(
        res,
        {
          message: 'Validation error',
          errors: ['test is required']
        },
        400
      );
    });
    
    test('validates request params when location is "params"', () => {
      // Set up request params
      req.params = { id: '123' };
      
      // Mock validation success
      validateSchema.mockReturnValue({ isValid: true, errors: [] });
      
      const middleware = validateRequest({ required: ['id'] }, 'params');
      middleware(req, res, next);
      
      expect(validateSchema).toHaveBeenCalledWith(req.params, { required: ['id'] });
      expect(next).toHaveBeenCalled();
    });
    
    test('validates request query when location is "query"', () => {
      // Set up request query
      req.query = { filter: 'active' };
      
      // Mock validation success
      validateSchema.mockReturnValue({ isValid: true, errors: [] });
      
      const middleware = validateRequest({ required: ['filter'] }, 'query');
      middleware(req, res, next);
      
      expect(validateSchema).toHaveBeenCalledWith(req.query, { required: ['filter'] });
      expect(next).toHaveBeenCalled();
    });
  });
  
  describe('Schema Definitions', () => {
    test('chatRequestSchema has required fields and properties', () => {
      expect(chatRequestSchema).toHaveProperty('required');
      expect(chatRequestSchema.required).toContain('message');
      expect(chatRequestSchema.required).toContain('healingName');
      
      expect(chatRequestSchema).toHaveProperty('properties');
      expect(chatRequestSchema.properties).toHaveProperty('message');
      expect(chatRequestSchema.properties).toHaveProperty('healingName');
      expect(chatRequestSchema.properties).toHaveProperty('storeConversation');
    });
    
    test('reflectionRequestSchema has required fields and properties', () => {
      expect(reflectionRequestSchema).toHaveProperty('required');
      expect(reflectionRequestSchema.required).toContain('healingName');
      expect(reflectionRequestSchema.required).toContain('content');
      
      expect(reflectionRequestSchema).toHaveProperty('properties');
      expect(reflectionRequestSchema.properties).toHaveProperty('healingName');
      expect(reflectionRequestSchema.properties).toHaveProperty('content');
      expect(reflectionRequestSchema.properties).toHaveProperty('milestone');
    });
    
    test('webhookRequestSchema has required fields and properties', () => {
      expect(webhookRequestSchema).toHaveProperty('required');
      expect(webhookRequestSchema.required).toContain('form_response');
      
      expect(webhookRequestSchema).toHaveProperty('properties');
      expect(webhookRequestSchema.properties).toHaveProperty('form_response');
      expect(webhookRequestSchema.properties.form_response).toHaveProperty('required');
      expect(webhookRequestSchema.properties.form_response.required).toContain('answers');
      expect(webhookRequestSchema.properties.form_response.required).toContain('submitted_at');
    });
  });
});

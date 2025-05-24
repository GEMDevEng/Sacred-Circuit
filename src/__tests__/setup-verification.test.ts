/**
 * Test to verify that our testing setup is working correctly
 */

describe('Testing Setup Verification', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('Environment variables are set', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.VITE_API_URL).toBeDefined();
  });

  test('Mock functions work', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  test('Async testing works', async () => {
    const asyncFunction = async () => {
      return new Promise(resolve => setTimeout(() => resolve('success'), 10));
    };

    const result = await asyncFunction();
    expect(result).toBe('success');
  });

  test('Basic string validation works', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect('John Doe'.length).toBeGreaterThan(0);
  });
});

import { renderHook, act } from '@testing-library/react';
import useForm from '../../hooks/useForm';

describe('useForm Hook', () => {
  // Define a simple form for testing
  interface TestForm {
    name: string;
    email: string;
  }

  // Define simple validators
  const nameValidator = (value: string) => 
    value.trim() === '' ? 'Name is required' : undefined;
  
  const emailValidator = (value: string) => 
    !value.includes('@') ? 'Invalid email' : undefined;

  test('initializes with provided values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues,
        onSubmit: jest.fn(),
      })
    );
    
    expect(result.current.values).toEqual(initialValues);
  });

  test('updates values on handleChange', () => {
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: { name: '', email: '' },
        onSubmit: jest.fn(),
      })
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.values.name).toBe('John');
  });

  test('validates fields on blur', () => {
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: { name: '', email: '' },
        validators: {
          name: [nameValidator],
        },
        onSubmit: jest.fn(),
      })
    );
    
    act(() => {
      result.current.handleBlur({
        target: { name: 'name', value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.touched.name).toBe(true);
  });

  test('validates all fields on submit', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: { name: '', email: 'invalid' },
        validators: {
          name: [nameValidator],
          email: [emailValidator],
        },
        onSubmit,
      })
    );
    
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Invalid email');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('calls onSubmit when validation passes', async () => {
    const onSubmit = jest.fn();
    const validValues = { name: 'John', email: 'john@example.com' };
    
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: validValues,
        validators: {
          name: [nameValidator],
          email: [emailValidator],
        },
        onSubmit,
      })
    );
    
    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>);
    });
    
    expect(onSubmit).toHaveBeenCalledWith(validValues);
  });

  test('resets form to initial values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues,
        onSubmit: jest.fn(),
      })
    );
    
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Jane' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    expect(result.current.values.name).toBe('Jane');
    
    act(() => {
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });

  test('sets field value programmatically', () => {
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: { name: '', email: '' },
        onSubmit: jest.fn(),
      })
    );
    
    act(() => {
      result.current.setFieldValue('name', 'John');
    });
    
    expect(result.current.values.name).toBe('John');
  });

  test('sets field error programmatically', () => {
    const { result } = renderHook(() => 
      useForm<TestForm>({
        initialValues: { name: '', email: '' },
        onSubmit: jest.fn(),
      })
    );
    
    act(() => {
      result.current.setFieldError('name', 'Custom error');
    });
    
    expect(result.current.errors.name).toBe('Custom error');
  });
});

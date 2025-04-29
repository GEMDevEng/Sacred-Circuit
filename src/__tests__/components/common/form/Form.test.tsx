import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from '../../../../components/common/form';

describe('Form Component', () => {
  test('renders children', () => {
    render(
      <Form>
        <div data-testid="test-child">Test Child</div>
      </Form>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  test('shows error message when provided', () => {
    const errorMessage = 'Form submission failed';
    render(
      <Form error={errorMessage}>
        <div>Test Child</div>
      </Form>
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('disables form fields when isLoading is true', () => {
    render(
      <Form isLoading={true}>
        <input data-testid="test-input" />
      </Form>
    );
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeDisabled();
  });

  test('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test('applies custom className', () => {
    const customClass = 'custom-class';
    render(
      <Form className={customClass}>
        <div>Test Child</div>
      </Form>
    );
    
    const form = screen.getByRole('form');
    expect(form).toHaveClass(customClass);
  });
});

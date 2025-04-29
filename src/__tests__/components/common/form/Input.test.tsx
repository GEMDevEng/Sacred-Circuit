import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../../../components/common/form';

describe('Input Component', () => {
  test('renders with label', () => {
    render(<Input label="Test Label" name="test" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  test('renders with required indicator', () => {
    render(<Input label="Test Label" name="test" required />);
    const label = screen.getByText('Test Label');
    expect(label.parentElement).toHaveTextContent('*');
  });

  test('shows error message when provided', () => {
    const errorMessage = 'This field is required';
    render(<Input label="Test Label" name="test" error={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('shows helper text when provided and no error', () => {
    const helperText = 'Helper text';
    render(<Input label="Test Label" name="test" helperText={helperText} />);
    expect(screen.getByText(helperText)).toBeInTheDocument();
  });

  test('prioritizes error over helper text', () => {
    const errorMessage = 'This field is required';
    const helperText = 'Helper text';
    render(
      <Input
        label="Test Label"
        name="test"
        error={errorMessage}
        helperText={helperText}
      />
    );
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
  });

  test('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    render(
      <Input label="Test Label" name="test" onChange={handleChange} />
    );
    
    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('applies error styling when error is provided', () => {
    render(
      <Input
        label="Test Label"
        name="test"
        error="Error message"
      />
    );
    
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-500');
  });

  test('forwards ref to input element', () => {
    const ref = jest.fn();
    render(<Input label="Test Label" name="test" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});

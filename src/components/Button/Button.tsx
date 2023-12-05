import { ReactElement } from 'react';
import Button, { ButtonOwnProps } from '@mui/material/Button';

type ButtonProps = {
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
  disabled?: boolean;
  variant?: ButtonOwnProps['variant'];
  fullWidth?: boolean;
  width?: number;
};

export default function MyButton({
  text,
  startIcon,
  endIcon,
  onClick,
  disabled,
  variant,
  fullWidth,
  width,
}: ButtonProps) {
  return (
    <Button
      variant={variant ?? 'outlined'}
      disabled={disabled || false}
      onClick={onClick}
      startIcon={startIcon || null}
      endIcon={endIcon || null}
      fullWidth={fullWidth}
      sx={{ width: width ?? null }}
    >
      {text}
    </Button>
  );
}

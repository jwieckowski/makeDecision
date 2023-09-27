import { ReactElement } from 'react';
import Button from '@mui/material/Button';

type ButtonProps = {
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
  disabled?: boolean;
};

export default function MyButton({ text, startIcon, endIcon, onClick, disabled }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      disabled={disabled || false}
      onClick={onClick}
      startIcon={startIcon || null}
      endIcon={endIcon || null}
    >
      {text}
    </Button>
  );
}

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type LoaderProps = {
  size?: number;
};

export default function Loader({ size }: LoaderProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress size={size ? size : 50} />
    </Box>
  );
}

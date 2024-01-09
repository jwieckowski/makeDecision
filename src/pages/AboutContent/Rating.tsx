import { Container, Typography } from '@mui/material';

export default function Rating() {
  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        Oceń nas
      </Typography>
    </Container>
  );
}

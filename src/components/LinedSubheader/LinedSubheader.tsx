import { Typography, Divider } from '@mui/material';

type LinedSubheaderProps = {
  label: string;
};

export default function LinedSubheader({ label }: LinedSubheaderProps) {
  return (
    <>
      <Divider textAlign="left" sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Divider>
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', display: { xs: 'block', md: 'none' }, borderBottom: '1px solid lightgrey' }}
      >
        {label}
      </Typography>
    </>
  );
}

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch } from 'react-redux'
import { methodsMenuClose } from '../../../data/actions/menu';


export default function Header() {
  const dispatch = useDispatch()

  function handleClick() {
    dispatch(methodsMenuClose())
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px'}}>
      <Typography variant="h5">
        Functionalities
      </Typography>
      <IconButton aria-label="Close methods drawer" onClick={handleClick}>
        <CloseIcon />
    </IconButton>
    </Box>
  );
}

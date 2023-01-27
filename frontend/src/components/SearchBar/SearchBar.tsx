import { useSelector } from 'react-redux' 
import { RootState, useAppDispatch } from '../../redux';
import { queryChange } from '../../redux/slices/searchSlice';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#777',
  '&:hover': {
    backgroundColor: '#AAA',
  },
  marginLeft: 0,
  width: '100%',
  margin: '10px 0'
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const { query } = useSelector((state: RootState) => state.search)

  return (
    <Box sx={{ width: '100%'}}>
        <Search>
        <SearchIconWrapper>
            <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Search…"
            onChange={e => dispatch(queryChange(e.target.value))}
            inputProps={{ 'aria-label': 'search', value: query }}
        />
        </Search>
    </Box>
  );
}

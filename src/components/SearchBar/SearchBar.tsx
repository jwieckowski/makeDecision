import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

// ICONS
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// REDUX
import { RootState, useAppDispatch } from '@/state';

// SLICES
import { queryChange } from '@/state/slices/searchSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
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
    padding: theme.spacing(1, 0, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '80%',
  },
}));

type ClearButtonProps = {
  clearSearchValue: () => void;
};

const ClearButton = ({ clearSearchValue }: ClearButtonProps) => {
  return (
    <Box
      sx={{ cursor: 'pointer', m: 0, p: 0, display: 'flex', alignItems: 'center' }}
      onClick={() => clearSearchValue()}
    >
      <ClearIcon />
    </Box>
  );
};

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { query } = useSelector((state: RootState) => state.search);
  const { t } = useTranslation();

  const clearSearchValue = () => {
    if (query === '') return;
    dispatch(queryChange(''));
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={`${t('common:search-placeholder')}`}
        inputProps={{ 'aria-label': 'search' }}
        value={query}
        onChange={(e) => dispatch(queryChange(e.target.value))}
        endAdornment={<ClearButton clearSearchValue={clearSearchValue} />}
      />
    </Search>
  );
}

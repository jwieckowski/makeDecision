import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// REDUX
import { useAppDispatch, useAppSelector } from '@/state';

// API
import { fetchAllMethods } from '@/api/dictionary';

// HOOKS
import { useLocale } from '@/hooks';

// TYPES
import { AllMethodsItem } from '@/types';

// UTILS
import { filterMethodsType } from '@/utils/filtering';

// COMPONENTS
import SearchBar from '@/components/SearchBar';
import Loader from '@/components/Loader';
import CollapseItem from './CollapseItem';

export default function CalculationsMenu() {
  const { blocks } = useAppSelector((state) => state.blocks);
  const { query } = useAppSelector((state) => state.search);
  const { allMethods, loading } = useAppSelector((state) => state.dictionary);
  const [openIndex, setOpenIndex] = useState('');

  const handleClick = (index: string) => {
    if (openIndex === index) {
      setOpenIndex('');
    } else {
      setOpenIndex(index);
    }
  };

  const handleItemClick = () => {
    console.log('clicked');
  };

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locale } = useLocale();

  const fetchData = async () => {
    await dispatch(fetchAllMethods(locale));
  };

  useEffect(() => {
    if (locale === '') return;
    if (allMethods.length === 0) fetchData();
  }, [locale]);

  const filteredData: [] | AllMethodsItem[] = useMemo(() => {
    if (locale === '') return [];

    let temp: [] | AllMethodsItem[] = [];

    filterMethodsType(allMethods, 'primary').forEach((methods) => {
      if (methods.key.toLowerCase().includes(query.toLowerCase())) {
        temp = [...temp, methods];
      } else {
        const filteredMethods = { ...methods };
        filteredMethods.data = [];
        methods.data.forEach((method) => {
          if (method.name.toLowerCase().includes(query.toLowerCase())) {
            filteredMethods.data = [...filteredMethods.data, method];
          }
        });
        if (filteredMethods.data.length > 0) temp = [...temp, filteredMethods];
      }
    });

    return temp;
  }, [allMethods, query, locale]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1, fontSize: 14, textTransform: 'uppercase' }}>
        <Typography variant="body2">{t('common:techniques')}</Typography>
      </Box>
      <Box sx={{ px: 1, mt: 1 }}>
        <SearchBar />
      </Box>
      {loading ? (
        <Box sx={{ height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={100} />
        </Box>
      ) : (
        <List sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {filteredData.map((item, index) => (
            <Box key={item.key}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleClick(`${index}`)}>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
                  {openIndex === `${index}` ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <CollapseItem
                open={openIndex === `${index}`}
                forceOpen={query !== '' && filteredData.length > 0}
                methods={item}
                onClick={handleItemClick}
              />
              <Divider sx={{ backgroundColor: '#6a6a6a' }} />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

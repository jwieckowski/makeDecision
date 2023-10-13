import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
// import { useTour } from "@reactour/tour";

// ICONS
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// REDUX
import { useAppDispatch, useAppSelector } from '@/state';

// API
import { fetchAllMethods } from '@/api/dictionary';

// SLICES
import { addBlock } from '@/state/slices/blocksSlice';

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

// CONST
import { DEFAULT_ALTERNATIVES, DEFAULT_CRITERIA } from '@/common/const';

export default function CalculationsMenu() {
  const { blocks } = useAppSelector((state) => state.blocks);
  const { query } = useAppSelector((state) => state.search);
  const { allMethods, loading } = useAppSelector((state) => state.dictionary);
  const [openIndex, setOpenIndex] = useState('');
  // const { isOpen, currentStep, setCurrentStep } = useTour();

  const handleClick = (index: string) => {
    if (openIndex === index) {
      setOpenIndex('');
    } else {
      setOpenIndex(index);
    }
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

  // useEffect(() => {
  //   if (!isOpen) return;
  //   if (currentStep !== 6 && currentStep !== 8) return;
  //   if ((currentStep === 6 && blocks.length > 0) || (currentStep === 8 && blocks.length > 1)) return;

  //   const index = currentStep === 6 ? 0 : 1;
  //   const { key, label, inputConnections, outputConnections } = allMethods[index];
  //   const { name, label: methodLabel } = allMethods[index].data[0];
  //   const block = {
  //     type: key.includes('matrix') ? key.split(' ')[1].toLowerCase() : key.toLowerCase(),
  //     typeLabel: label.toLocaleLowerCase(),
  //     method: name.toLowerCase(),
  //     label: methodLabel.toLowerCase(),
  //     inputConnections,
  //     outputConnections,
  //     data: {
  //       matrix: [],
  //       matrixFile: [],
  //       fileName: null,
  //       randomMatrix: [],
  //       types: [],
  //       weights: [],
  //       extension: 'crisp',
  //       additionals: [],
  //       alternatives: DEFAULT_ALTERNATIVES,
  //       criteria: DEFAULT_CRITERIA,
  //       styles: null,
  //     },
  //   };
  //   dispatch(addBlock(block));
  // }, [currentStep]);

  function handleMethodItemClick(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    type: string,
    typeLabel: string,
    method: string,
    label: string,
    inputConnections: [] | string[],
    outputConnections: [] | string[],
  ) {
    e.preventDefault();

    const block = {
      type: type.includes('matrix') ? type.split(' ')[1].toLowerCase() : type.toLowerCase(),
      typeLabel: typeLabel.toLocaleLowerCase(),
      method: method.toLowerCase(),
      label: label.toLowerCase(),
      inputConnections,
      outputConnections,
      data: {
        matrix: [],
        matrixFile: [],
        fileName: null,
        randomMatrix: [],
        types: [],
        weights: [],
        extension: 'crisp',
        additionals: [],
        alternatives: DEFAULT_ALTERNATIVES,
        criteria: DEFAULT_CRITERIA,
        styles: null,
      },
    };
    dispatch(addBlock(block));

    // if (isOpen) setCurrentStep((prev) => prev + 1);
  }

  return (
    <Box
      sx={{
        display: {
          xs: 'none',
          md: 'block',
        },
      }}
    >
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
              <ListItem disablePadding sx={{ backgroundColor: 'secondary.dark' }}>
                <ListItemButton onClick={() => handleClick(`${index}`)}>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
                  {openIndex === `${index}` ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <CollapseItem
                open={openIndex === `${index}`}
                forceOpen={query !== '' && filteredData.length > 0}
                methods={item}
                onClick={handleMethodItemClick}
              />
              <Divider sx={{ backgroundColor: '#6a6a6a' }} />
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

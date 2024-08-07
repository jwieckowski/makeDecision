// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTour } from '@reactour/tour';

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
import { useLocale, useConnectionList } from '@/hooks';

// TYPES
import { AllMethodsItem } from '@/types';

// UTILS
import { filterMethodsFunction, getKwargsFromDictionary } from '@/utils/filtering';

// COMPONENTS
import SearchBar from '@/components/SearchBar';
import Loader from '@/components/Loader';
import CollapseItem from './CollapseItem';

// CONST
import { DEFAULT_ALTERNATIVES, DEFAULT_CRITERIA } from '@/common/calculations';

export default function CalculationsMenu() {
  const { blocks } = useAppSelector((state) => state.blocks);
  const { query } = useAppSelector((state) => state.search);
  const { allMethods, loading, error } = useAppSelector((state) => state.dictionary);
  const { addListNode } = useConnectionList();
  const [openIndex, setOpenIndex] = useState('');
  const { isOpen, currentStep, setCurrentStep } = useTour();

  const hasAddedMatrixBlockRef = useRef(false);
  const hasAddedWeightsBlockRef = useRef(false);

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

    filterMethodsFunction(allMethods, 'primary').forEach((methods) => {
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

  useEffect(() => {
    if (currentStep === 4) {
      setOpenIndex('0');
    }
    if (currentStep === 6) {
      setOpenIndex('1');
    }
  }, [currentStep]);

  const getIsFilled = (type: string, name: string) => {
    if (type.toLowerCase() === 'matrix') return false;
    if (
      type.toLowerCase() === 'method' &&
      getKwargsFromDictionary(allMethods, name)?.filter((item) => item.extension === 'crisp').length > 0
    )
      return false;
    if (type.toLowerCase() === 'weights' && name.toLowerCase() === 'input') return false;
    return true;
  };

  function handleMethodItemClick(
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    type: string,
    name: string,
    inputConnections: string[],
    outputConnections: string[],
    extensions: string[],
  ) {
    e.preventDefault();

    const block = {
      type: type.toLowerCase(),
      name: name.toLowerCase(),
      inputConnections,
      outputConnections,
      typeKwargs: type.toLowerCase() === 'method' ? getKwargsFromDictionary(allMethods, name) : [],
      data: {
        matrix: [],
        fileName: null,
        criteriaTypes: [],
        weights: [],
        extension: 'crisp',
        kwargs: [],
        alternatives: DEFAULT_ALTERNATIVES,
        criteria: DEFAULT_CRITERIA,
        preference: [],
      },
      error: false,
      errorMessage: null,
      isFilled: getIsFilled(type, name),
      position: {
        x: isOpen && currentStep === 7 ? 300 : 100,
        y: 100,
      },
    };
    dispatch(addBlock(block));
    addListNode(
      blocks.length === 0 ? 1 : Math.max(...blocks.map((b) => b.id)) + 1,
      type,
      name,
      inputConnections,
      outputConnections,
      extensions,
    );

    if (isOpen) setCurrentStep((prev) => prev + 1);
  }

  return (
    <Box
      className="tour-step-five"
      sx={{
        display: {
          xs: 'none',
          md: 'block',
        },
        flex: 1,
      }}
    >
      {loading ? (
        <Box sx={{ height: '200px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader size={100} />
        </Box>
      ) : !error ? (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              pl: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 14, textTransform: 'uppercase' }}>
              {t('common:techniques')}
            </Typography>
          </Box>
          <Box sx={{ px: 1, mt: 1 }}>
            <SearchBar />
          </Box>
          <List>
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
        </>
      ) : (
        <Typography textAlign="center" sx={{ mt: 2 }} variant="h6">
          {t('common:general-error')}
        </Typography>
      )}
    </Box>
  );
}

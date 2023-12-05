import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Box, Divider, SelectChangeEvent, TextField } from '@mui/material';

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';
import { BlockType } from '@/types';

// API
import { uploadMatrixFile, generateMatrix } from '@/api/calculations';

// SLICES
import {
  setBlockExtension,
  setBlockWeights,
  setBlockAdditionals,
  setBlockMatrix,
  setBlockTypes,
  setBlockFileName,
  setBlockAlternatives,
  setBlockCriteria,
  blockFileDelete,
} from '@/state/slices/blocksSlice';
import { resetConvertedMatrix } from '@/state/slices/calculationSlice';

// HOOKS
import { useLocale } from '@/hooks';

// COMPONENTS
import FileUploader from '@/components/FileUploader';
import { default as InputMatrix } from '@/components/InputMatrix';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import CriteriaTypes from '@/components/CriteriaTypes';

// UTILS
import useCalculation from '@/utils/calculation';
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput, convertTextLength } from '@/utils/formatting';
import useSnackbars from '@/utils/snackbars';

// CONST
import { MIN_ALTERNATIVES, MAX_ALTERNATIVES, MIN_CRITERIA, MAX_CRITERIA } from '@/common/const';

type MatrixProps = {
  data: null | BlockType;
};

export default function Matrix({ data }: MatrixProps) {
  const { blocks, connections } = useAppSelector((state) => state.blocks);
  const { convertedMatrix } = useAppSelector((state) => state.calculation);

  const [matrix, setMatrix] = useState<string[][]>([]);
  const [criteriaTypes, setCriteriaTypes] = useState<string[]>([]);
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { showSnackbar } = useSnackbars();
  const { validateCrispInput, validateFuzzyInput } = useValidation();
  const { getMatrixWeightsConnections, getWeightsMethodConnections } = useCalculation();

  function validateInput(value: number, min: number, max: number, cb: Function) {
    console.log('tu');
    console.log(value >= min ? (value > max ? max : +value) : min);
    dispatch(cb(value >= min ? (value > max ? max : +value) : min));
  }

  // INPUT MATRIX EFFECTS
  useEffect(() => {
    if (data === null) return;

    // const { alternatives, criteria } = data.data;

    // const weightsBlock = getMatrixWeightsConnections(blocks, connections, data);
    // weightsBlock.forEach((b) => {
    //   dispatch(
    //     setBlockCriteria({
    //       id: b.id,
    //       data: criteria,
    //     }),
    //   );
    // });

    // let value = '';
    // if (data.data.extension === 'crisp') value = '0';
    // else if (data.data.extension === 'fuzzy') value = '0, 0, 0';

    // // FILL BLOCK MATRIX WITH VALUES
    // if (alternatives > 0 && criteria > 0) {
    //   let copy = Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES)
    //     .fill(null)
    //     .map(() => Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(value));

    //   if (data.data.matrix.length > 0) {
    //     if (
    //       (data.data.extension === 'crisp' && !`${data.data.matrix[0][0]}`.includes(',')) ||
    //       (data.data.extension === 'fuzzy' && `${data.data.matrix[0][0]}`.includes(','))
    //     )
    //       copy = copy.map((r, idx) => {
    //         return r.map((c, idxx) => {
    //           return idx < data.data.matrix.length && idxx < data.data.matrix[0].length
    //             ? `${data.data.matrix[idx][idxx]}`
    //             : c;
    //         });
    //       });
    //   }

    //   setMatrix([...copy]);
    //   dispatch(
    //     setBlockMatrix({
    //       id: data?.id,
    //       data: [
    //         ...copy.map((r) => {
    //           return r.map((c) => (data.data.extension === 'crisp' ? +c : c));
    //         }),
    //       ],
    //     }),
    //   );
    // }
  }, [data?.data.alternatives, data?.data.criteria, data?.data.extension]);

  useEffect(() => {
    // if (data === null) return;
    // if (data.data.matrix.length !== 0) {
    //   setMatrix([...data.data.matrix]);
    // }
    // if (data.data.criteria > MAX_CRITERIA) return;
    // if (data.data.criteria > 0) {
    //   let copy = Array(data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA).fill('');
    //   copy = copy.map((r, idx) => {
    //     return idx < data.data.criteriaTypes.length ? data.data.criteriaTypes[idx] : r;
    //   });
    //   setCriteriaTypes([...copy]);
    // }
  }, [data]);

  // UPLOAD FILE EFFECTS
  useEffect(() => {
    // if (convertedMatrix !== null && Object.keys(convertedMatrix).length !== 0) {
    //   dispatch(
    //     setBlockMatrix({
    //       id: data?.id,
    //       data: convertedMatrix['matrix'],
    //     }),
    //   );
    //   dispatch(
    //     setBlockTypes({
    //       id: data?.id,
    //       data: convertedMatrix['criteriaTypes'],
    //     }),
    //   );
    //   dispatch(
    //     setBlockCriteria({
    //       id: data?.id,
    //       data: convertedMatrix['criteriaTypes']?.length,
    //     }),
    //   );
    //   dispatch(
    //     setBlockAlternatives({
    //       id: data?.id,
    //       data: convertedMatrix['matrix'].length,
    //     }),
    //   );
    //   dispatch(resetConvertedMatrix());
    // }
  }, [convertedMatrix]);

  // CRITERIA TYPES EFFECTS
  useEffect(() => {
    if (data === null) return;
    if (data.data.criteria > MAX_CRITERIA) return;

    // dispatch(
    //   setBlockTypes({
    //     id: data?.id,
    //     data: data.data.criteriaTypes.filter((c, idx) => idx < data.data.criteria),
    //   }),
    // );
  }, [data?.data.criteria]);

  const handleFileDelete = () => {
    // dispatch(
    //   blockFileDelete({
    //     id: data?.id,
    //   }),
    // );
    // dispatch(resetConvertedMatrix());
    // setShowMatrix(false);
  };

  const handleExtensionChange = (event: SelectChangeEvent) => {
    // dispatch(
    //   setBlockExtension({
    //     id: data?.id,
    //     data: event.target.value as string,
    //   }),
    // );
    // // CLEAR FILE
    // if (data?.name === 'file') handleFileDelete();
    // // UPDATE EXTENSIONS IN WEIGHTS AND METHODS BLOCKS
    // if (data !== null) {
    //   const weightsBlock = getMatrixWeightsConnections(blocks, connections, data);
    //   weightsBlock.forEach((b) => {
    //     dispatch(
    //       setBlockWeights({
    //         id: b.id,
    //         data: [],
    //       }),
    //     );
    //   });
    //   getWeightsMethodConnections(weightsBlock, blocks, connections).forEach((block) => {
    //     block.forEach((b) => {
    //       dispatch(
    //         setBlockAdditionals({
    //           id: b.id,
    //           data: [],
    //         }),
    //       );
    //     });
    //   });
    // }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>, col: number | undefined) => {
    if (col === undefined) return;
    const copy = [...criteriaTypes];
    copy[col] = event.target.value as string;
    // setCriteriaTypes(copy);
    // dispatch(setBlockTypes({ id: data?.id, data: copy }));
  };

  function changeAlternatives(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const value = e.target.value;
    if (isNaN(+value)) return;
    // dispatch(
    //   setBlockAlternatives({
    //     id: data?.id,
    //     data: +value,
    //   }),
    // );
  }

  function changeCriteria(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const value = e.target.value;
    if (isNaN(+value)) return;
    // dispatch(
    //   setBlockCriteria({
    //     id: data?.id,
    //     data: +value,
    //   }),
    // );
  }

  const handleMatrixInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    e.preventDefault();
    // if (data === null) return;

    // // VALIDATE INPUT
    // if (!validateCrispInput(data, e.target.value) || !validateFuzzyInput(data, e.target.value)) return;

    // // COPY MATRIX AND CHANGE SINGLE VALUE
    // let copy = [...matrix];
    // copy = copy.map((r, idx) => {
    //   return idx === row
    //     ? r.map((c, idxx) => {
    //         return idxx === col
    //           ? data.data.extension === 'crisp'
    //             ? convertCrispInput(e.target.value)
    //             : convertFuzzyInput(e.target.value)
    //           : c;
    //       })
    //     : r;
    // });

    // // CHANGE MATRIX DATA STATE
    // setMatrix([...copy]);
    // dispatch(
    //   setBlockMatrix({
    //     id: data?.id,
    //     data: copy,
    //   }),
    // );
  };

  // MATRIX FILE UPLOAD
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // if (e.target.files) {
    //   if (data?.data.extension) {
    //     const formData = new FormData();
    //     formData.append(
    //       'matrix',
    //       new Blob([e.target.files[0]], { type: e.target.files[0].type }),
    //       e.target.files[0].name,
    //     );
    //     formData.append('extension', data?.data.extension);
    //     setShowMatrix(false);
    //     const response = await dispatch(uploadMatrixFile({ locale, body: formData }));
    //     if (response.meta.requestStatus === 'fulfilled') {
    //       showSnackbar(t('snackbar:matrix-upload-success'), 'success');
    //       dispatch(
    //         setBlockFileName({
    //           id: data?.id,
    //           data: e.target.files[0].name,
    //         }),
    //       );
    //     }
    //   }
    // }
  };

  const items = [
    {
      label: t('results:crisp'),
      value: 'crisp',
    },
    {
      label: t('results:fuzzy'),
      value: 'fuzzy',
    },
  ];

  return (
    <Container>
      <Stack direction="column" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Divider textAlign="center">{data?.name.toUpperCase()}</Divider>
        <Stack direction="row" gap={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Select
            label={t('results:extension') as string}
            items={items}
            value={data === null ? 'crisp' : data.data.extension}
            onChange={handleExtensionChange}
            minWidth={200}
          />
          {data !== null && data.name !== 'file' ? (
            <>
              <Input
                type="number"
                value={data.data.alternatives}
                label={t('results:alternatives') as string}
                onChange={(e) => changeAlternatives(e)}
                width={70}
                min={MIN_ALTERNATIVES}
                max={MAX_ALTERNATIVES}
                // onBlur={() =>
                //   // validateInput(data.data.alternatives, MIN_ALTERNATIVES, MAX_ALTERNATIVES, setBlockAlternatives)
                //   console.log('blur')
                // }
              />
              <Input
                type="number"
                value={data.data.criteria}
                label={t('results:criteria') as string}
                onChange={(e) => changeCriteria(e)}
                width={70}
                min={MIN_CRITERIA}
                max={MAX_CRITERIA}
                // onBlur={() => validateInput(data.data.criteria, MIN_CRITERIA, MAX_CRITERIA, setBlockCriteria)}
              />
            </>
          ) : null}
        </Stack>
      </Stack>
      {/* FILE TYPE */}
      {data !== null && data.name === 'file' ? (
        <>
          <FileUploader onUpload={handleFileChange} label={t('common:upload-files') as string} />
          {data.data.fileName !== null ? (
            <Container>
              <Stack direction="row" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Checkbox
                  id="showMatrixCheckbox"
                  label={`${t('common:edit-uploaded-matrix')}`}
                  value={showMatrix}
                  onChange={(e) => setShowMatrix(e.target.checked)}
                />
                <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Container disableGutters sx={{ pr: 1 }}>
                    <Typography align="right">{t('common:uploaded-file')} </Typography>
                    <Typography align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                      {convertTextLength(data.data.fileName)}
                    </Typography>
                  </Container>
                  <DeleteIcon onClick={handleFileDelete} sx={{ cursor: 'pointer' }} />
                </Stack>
              </Stack>
            </Container>
          ) : null}
        </>
      ) : null}
      {/* INPUT AND FILE TYPE */}
      {data !== null && (data.name === 'input' || showMatrix) ? (
        <Box mt={2}>
          <Stack direction="row" gap={1}>
            <InputMatrix
              matrix={data.data.matrix}
              alternatives={data.data.alternatives}
              criteria={data.data.criteria}
              extension={data.data.extension}
              onChange={handleMatrixInputChange}
              criteriaTypes={data.data.criteriaTypes}
              onCriteriaTypeChange={handleTypeChange}
            />
          </Stack>
        </Box>
      ) : null}
      {/* CRITERIA TYPES */}
      {data !== null && data.name === 'random' ? (
        <Container maxWidth="md" sx={{ overflow: 'auto', py: 2 }}>
          <CriteriaTypes
            criteria={data.data.criteria}
            criteriaTypes={data.data.criteriaTypes}
            onCriteriaTypeChange={handleTypeChange}
          />
        </Container>
      ) : null}
    </Container>
  );
}

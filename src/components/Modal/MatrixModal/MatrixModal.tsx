import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Box, Divider, SelectChangeEvent, TextField } from '@mui/material';

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// COMPONENTS
import FileUploader from '@/components/FileUploader';
import { default as InputMatrix } from '@/components/Matrix';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import CriteriaTypes from '@/components/CriteriaTypes';
import Button from '@/components/Button';
import ModalContainer from '../ModalContainer';

// SLICES
import { resetConvertedMatrix } from '@/state/slices/calculationSlice';

// API
import { uploadMatrixFile, generateMatrix } from '@/api/calculations';

// HOOKS
import { useLocale } from '@/hooks';

// CONST
import {
  MIN_ALTERNATIVES,
  MAX_ALTERNATIVES,
  MIN_CRITERIA,
  MAX_CRITERIA,
  DEFAULT_ALTERNATIVES,
  DEFAULT_CRITERIA,
} from '@/common/const';

// UTILS
// import useCalculation from '@/utils/calculation';
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput, convertTextLength } from '@/utils/formatting';
import useSnackbars from '@/utils/snackbars';
import {
  setBlockAlternatives,
  setBlockCriteria,
  setBlockExtension,
  setBlockFileName,
  setBlockMatrix,
  setBlockTypes,
} from '@/state/slices/blocksSlice';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  handleClose: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

export default function MatrixModal({ open, closeModal, handleClose, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const { convertedMatrix } = useAppSelector((state) => state.calculation);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbars();
  const { validateCrispInput, validateFuzzyInput } = useValidation();
  const { locale } = useLocale();

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

  const [alternatives, setAlternatives] = useState<number>(activeBlock?.data.alternatives ?? DEFAULT_ALTERNATIVES);
  const [criteria, setCriteria] = useState<number>(activeBlock?.data.criteria ?? DEFAULT_CRITERIA);
  const [extension, setExtension] = useState<string>(activeBlock?.data.extension ?? items[0].value);
  const [filename, setFilename] = useState<null | string>(activeBlock?.data.fileName ?? null);
  const [matrix, setMatrix] = useState<string[][]>(activeBlock?.data.matrix ?? []);
  const [criteriaTypes, setCriteriaTypes] = useState<string[]>(
    activeBlock?.data.criteriaTypes ?? Array(DEFAULT_CRITERIA).fill(`1`),
  );
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  const [lowerBound, setLowerBound] = useState<number>(0);
  const [upperBound, setUpperBound] = useState<number>(1);
  const [precision, setPrecision] = useState<number>(3);

  // INPUT MATRIX EFFECTS
  useEffect(() => {
    let value = '';
    if (extension === 'crisp') value = '0';
    else if (extension === 'fuzzy') value = '0, 0, 0';

    // FILL BLOCK MATRIX WITH VALUES
    if (alternatives > 0 && criteria > 0) {
      let copy = Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES)
        .fill(null)
        .map(() => Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(value));

      if (matrix.length > 0) {
        if (
          (extension === 'crisp' && !`${matrix[0][0]}`.includes(',')) ||
          (extension === 'fuzzy' && `${matrix[0][0]}`.includes(','))
        )
          copy = copy.map((r, idx) => {
            return r.map((c, idxx) => {
              return idx < matrix.length && idxx < matrix[0].length ? `${matrix[idx][idxx]}` : c;
            });
          });
      }

      setMatrix([...copy]);
    }
  }, [alternatives, criteria, extension]);

  // UPLOAD FILE EFFECTS
  useEffect(() => {
    if (convertedMatrix !== null && Object.keys(convertedMatrix).length !== 0) {
      setMatrix(convertedMatrix['matrix']);
      setCriteriaTypes(convertedMatrix['criteria_types']);
      setAlternatives(convertedMatrix['matrix']?.length);
      setCriteria(convertedMatrix['criteria_types']?.length);
      dispatch(resetConvertedMatrix());
    }
  }, [convertedMatrix]);

  // CRITERIA TYPES EFFECTS
  useEffect(() => {
    if (criteria > MAX_CRITERIA) return;
    if (criteriaTypes.length > criteria) setCriteriaTypes((prev) => prev.filter((_, idx) => idx < criteria));
    else
      setCriteriaTypes(
        Array(criteria)
          .fill('1')
          .map((value, idx) => (idx < criteriaTypes.length ? criteriaTypes[idx] : value)),
      );
  }, [criteria]);

  const handleAlternativesChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (isNaN(+event.target.value)) return;
    setAlternatives(+event.target.value);
  };

  const handleCriteriaChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (isNaN(+event.target.value)) return;
    setCriteria(+event.target.value);
  };

  const handleFileDelete = () => {
    setFilename(null);
    dispatch(resetConvertedMatrix());
    setShowMatrix(false);
  };

  const handleMatrixInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    e.preventDefault();
    if (activeBlock === null) return;

    // VALIDATE INPUT
    if (!validateCrispInput(extension, e.target.value) || !validateFuzzyInput(extension, e.target.value)) return;

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...matrix];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return idxx === col
              ? extension === 'crisp'
                ? convertCrispInput(e.target.value)
                : convertFuzzyInput(e.target.value)
              : c;
          })
        : r;
    });

    setMatrix([...copy]);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>, col: number | undefined) => {
    if (col === undefined) return;
    const copy = [...criteriaTypes];
    copy[col] = event.target.value as string;
    setCriteriaTypes(copy);
  };

  const handleExtensionChange = (event: SelectChangeEvent) => {
    setExtension(event.target.value as string);
    // CLEAR FILE
    if (activeBlock?.name === 'file') handleFileDelete();
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

  // MATRIX FILE UPLOAD
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (extension) {
        const formData = new FormData();
        formData.append(
          'matrix',
          new Blob([e.target.files[0]], { type: e.target.files[0].type }),
          e.target.files[0].name,
        );
        formData.append('extension', extension);
        setShowMatrix(false);
        const response = await dispatch(uploadMatrixFile({ locale, body: formData }));
        if (response.meta.requestStatus === 'fulfilled') {
          showSnackbar(t('snackbar:matrix-upload-success'), 'success');
          setFilename(e.target.files[0].name);
        }
      }
    }
  };

  // MATRIX GENERATION
  const handleGenerateMatrix = async () => {
    const response = await dispatch(
      generateMatrix({
        locale,
        body: {
          extension: extension,
          alternatives: alternatives,
          criteria: criteria,
          lower_bound: lowerBound,
          upper_bound: upperBound,
          precision: precision,
        },
      }),
    );
    if (response.meta.requestStatus === 'fulfilled') {
      showSnackbar(t('snackbar:matrix-generated-success'), 'success');
      setMatrix(response.payload.matrix);
      setCriteriaTypes(response.payload.criteria_types);
    }
  };

  const handleSave = () => {
    if (activeBlock === null) return;

    dispatch(
      setBlockExtension({
        id: activeBlock.id,
        data: extension,
      }),
    );

    dispatch(
      setBlockAlternatives({
        id: activeBlock.id,
        data: alternatives,
      }),
    );

    dispatch(
      setBlockCriteria({
        id: activeBlock.id,
        data: criteria,
      }),
    );

    dispatch(
      setBlockMatrix({
        id: activeBlock.id,
        data: matrix,
      }),
    );

    dispatch(
      setBlockFileName({
        id: activeBlock.id,
        data: filename,
      }),
    );

    dispatch(
      setBlockTypes({
        id: activeBlock.id,
        data: criteriaTypes,
      }),
    );

    handleClose();
  };

  return (
    <ModalContainer
      title={t('results:matrix')}
      open={open}
      closeModal={closeModal}
      handleClose={handleClose}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
    >
      <Container>
        <Stack direction="column" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
          {/* EXTENSION AND NUMBER OF CRITERIA AND ALTERNATIVES */}
          <Stack direction="row" gap={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Select
              label={t('results:extension') as string}
              items={items}
              value={extension}
              onChange={handleExtensionChange}
              minWidth={200}
            />
            {activeBlock !== null && activeBlock.name !== 'file' ? (
              <>
                <Input
                  type="number"
                  value={alternatives}
                  label={t('results:alternatives') as string}
                  onChange={(e) => handleAlternativesChange(e)}
                  width={100}
                  min={MIN_ALTERNATIVES}
                  max={MAX_ALTERNATIVES}
                  // onBlur={() =>
                  //   // validateInput(data.data.alternatives, MIN_ALTERNATIVES, MAX_ALTERNATIVES, setBlockAlternatives)
                  //   console.log('blur')
                  // }
                />
                <Input
                  type="number"
                  value={criteria}
                  label={t('results:criteria') as string}
                  onChange={(e) => handleCriteriaChange(e)}
                  width={100}
                  min={MIN_CRITERIA}
                  max={MAX_CRITERIA}
                  // onBlur={() => validateInput(data.data.criteria, MIN_CRITERIA, MAX_CRITERIA, setBlockCriteria)}
                />
              </>
            ) : null}
          </Stack>
          {/* RANDOM MATRIX SETTINGS */}
          {activeBlock !== null && activeBlock.name === 'random' ? (
            <Stack direction="row" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Input
                type="number"
                value={lowerBound}
                label={t('results:lower-bound') as string}
                onChange={(e) => setLowerBound(+e.target.value)}
                width={90}
                min={0}
                step={1}
                // onBlur={() => validateInput(data.data.criteria, MIN_CRITERIA, MAX_CRITERIA, setBlockCriteria)}
              />
              <Input
                type="number"
                value={upperBound}
                label={t('results:upper-bound') as string}
                onChange={(e) => setUpperBound(+e.target.value)}
                width={90}
                min={1}
                step={1}
                // onBlur={() => validateInput(data.data.criteria, MIN_CRITERIA, MAX_CRITERIA, setBlockCriteria)}
              />
              <Input
                type="number"
                value={precision}
                label={t('results:precision') as string}
                onChange={(e) => setPrecision(+e.target.value)}
                width={80}
                min={0}
                step={1}
                // onBlur={() => validateInput(data.data.criteria, MIN_CRITERIA, MAX_CRITERIA, setBlockCriteria)}
              />
              <Button text={t('results:generate')} onClick={handleGenerateMatrix} />
            </Stack>
          ) : null}
        </Stack>
        {/* FILE TYPE */}
        {activeBlock !== null && activeBlock.name === 'file' ? (
          <>
            <FileUploader onUpload={handleFileChange} label={t('common:upload-files') as string} />
            {filename !== null ? (
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
                        {convertTextLength(filename)}
                      </Typography>
                    </Container>
                    <DeleteIcon onClick={handleFileDelete} sx={{ cursor: 'pointer' }} />
                  </Stack>
                </Stack>
              </Container>
            ) : null}
          </>
        ) : null}
        {/* INPUT MATRIX */}
        {activeBlock !== null && (['input', 'random'].includes(activeBlock.name) || showMatrix) ? (
          <Box mt={2}>
            <Stack direction="row" gap={1}>
              <InputMatrix
                matrix={matrix}
                alternatives={alternatives}
                criteria={criteria}
                extension={extension}
                onChange={handleMatrixInputChange}
                criteriaTypes={criteriaTypes}
                onCriteriaTypeChange={handleTypeChange}
              />
            </Stack>
          </Box>
        ) : null}
      </Container>
    </ModalContainer>
  );
}
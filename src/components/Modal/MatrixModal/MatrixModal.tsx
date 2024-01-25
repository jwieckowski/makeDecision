// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useMemo, useEffect, ChangeEvent, FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Box, Divider } from '@mui/material';

// ICONS
import DeleteIcon from '@mui/icons-material/Delete';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// COMPONENTS
import FileUploader from '@/components/FileUploader';
import InputMatrix from '@/components/InputMatrix';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import Loader from '@/components/Loader';
import ModalContainer from '../ModalContainer';

// SLICES
import { resetConvertedMatrix } from '@/state/slices/calculationSlice';
import { setBlockCriteria, setBlockData, setBlockError, setBlockFilled } from '@/state/slices/blocksSlice';

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
} from '@/common/calculations';

// UTILS
import useCalculation from '@/utils/calculation';
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput, convertTextLength } from '@/utils/formatting';
import useSnackbars from '@/utils/snackbars';
import useBlocksConnection from '@/utils/connections';

// COMPONENTS
import ModificationModal from '../ModificationModal';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

type MatrixCellProps = {
  value: string;
  error: boolean;
};

type FormProps = {
  alternatives: number;
  criteria: number;
  extension: string;
  fileName: null | string;
  lowerBound: string;
  upperBound: string;
  precision: string;
  boundsError: boolean;
  generateDisable: boolean;
  modified: boolean;
  showMatrix: boolean;
  matrixError: null | string;
};

export default function MatrixModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { matrixLoading } = useAppSelector((state) => state.calculation);
  const { activeBlock, blocks, connections } = useAppSelector((state) => state.blocks);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbars();
  const { isCrispInputValid, isFuzzyInputValid, validateMatrixBounds, validateMatrixData } = useValidation();
  const { getMatrixWeightsConnections } = useCalculation();
  const { getInputConnections, getOutputConnections } = useBlocksConnection();
  const { locale } = useLocale();

  const [fileError, setFileError] = useState<boolean>(false);

  const extensionItems = useMemo(
    () => [
      {
        label: t('results:crisp'),
        value: 'crisp',
      },
      {
        label: t('results:fuzzy'),
        value: 'fuzzy',
      },
    ],
    [],
  );

  const alternativesItems = useMemo(
    () =>
      Array(MAX_ALTERNATIVES - MIN_ALTERNATIVES)
        .fill(0)
        .map((_, i) => ({ label: `${i + 1 + MIN_ALTERNATIVES}`, value: `${i + 1 + MIN_ALTERNATIVES}` })),
    [],
  );

  const criteriaItems = useMemo(
    () =>
      Array(MAX_CRITERIA - MIN_CRITERIA)
        .fill(0)
        .map((_, i) => ({ label: `${i + 1 + MIN_CRITERIA}`, value: `${i + 1 + MIN_CRITERIA}` })),
    [],
  );

  const precisionItems = Array(6)
    .fill(0)
    .map((_, idx) => ({ value: `${idx}`, label: `${idx}` }));

  const [form, setForm] = useState<FormProps>({
    alternatives: activeBlock?.data.alternatives ?? DEFAULT_ALTERNATIVES,
    criteria: activeBlock?.data.criteria ?? DEFAULT_CRITERIA,
    extension: activeBlock?.data.extension ?? extensionItems[0].value,
    fileName: activeBlock?.data.fileName ?? null,
    lowerBound: '0',
    upperBound: '1',
    precision: '3',
    boundsError: false,
    generateDisable: false,
    modified: false,
    showMatrix: false,
    matrixError: null,
  });

  const [matrix, setMatrix] = useState<MatrixCellProps[][]>(
    activeBlock?.data.matrix.length !== 0
      ? activeBlock?.data.matrix.map((r) => r.map((c) => ({ value: c, error: false })))
      : [],
  );
  const [criteriaTypes, setCriteriaTypes] = useState<string[]>(
    activeBlock?.data.criteriaTypes ?? Array(DEFAULT_CRITERIA).fill(`1`),
  );
  const [modifiedModalOpen, setModifiedModalOpen] = useState<boolean>(false);

  const isGenerateDisabled = (lowerBound: string, upperBound: string) => {
    if (
      validateInput(form.alternatives, MIN_ALTERNATIVES, MAX_ALTERNATIVES) ||
      validateInput(form.criteria, MIN_CRITERIA, MAX_CRITERIA) ||
      lowerBound === '' ||
      upperBound === ''
    )
      return true;
    return false;
  };

  // INPUT MATRIX EFFECTS
  useEffect(() => {
    setForm({
      ...form,
      generateDisable: isGenerateDisabled(form.lowerBound, form.upperBound),
    });
    if (
      form.alternatives < MIN_ALTERNATIVES ||
      form.alternatives > MAX_ALTERNATIVES ||
      form.criteria < MIN_CRITERIA ||
      form.criteria > MAX_CRITERIA
    )
      return;

    let value = '';
    if (form.extension === 'crisp') value = '0';
    else if (form.extension === 'fuzzy') value = '0, 0, 0';

    // FILL BLOCK MATRIX WITH VALUES
    if (form.alternatives > 0 && form.criteria > 0) {
      let copy = Array(form.alternatives <= MAX_ALTERNATIVES ? form.alternatives : MAX_ALTERNATIVES)
        .fill(null)
        .map(() => Array(form.criteria <= MAX_CRITERIA ? form.criteria : MAX_CRITERIA).fill({ value, error: false }));

      if (matrix.length > 0) {
        if (
          (form.extension === 'crisp' && !`${matrix[0][0].value}`.includes(',')) ||
          (form.extension === 'fuzzy' && `${matrix[0][0].value}`.includes(','))
        )
          copy = copy.map((r, idx) => {
            return r.map((c, idxx) => {
              return {
                ...c,
                value: idx < matrix.length && idxx < matrix[0].length ? `${matrix[idx][idxx].value}` : c.value,
              };
            });
          });
      }

      setMatrix([...copy]);
    }
  }, [form.alternatives, form.criteria, form.extension]);

  // CRITERIA TYPES EFFECTS
  useEffect(() => {
    if (form.criteria > MAX_CRITERIA) return;
    if (criteriaTypes.length > form.criteria) setCriteriaTypes((prev) => prev.filter((_, idx) => idx < form.criteria));
    else
      setCriteriaTypes(
        Array(form.criteria)
          .fill('1')
          .map((value, idx) => (idx < criteriaTypes.length ? criteriaTypes[idx] : value)),
      );
  }, [form.criteria]);

  const validateInput = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };

  const handleFileDelete = () => {
    dispatch(resetConvertedMatrix());
    setForm((prev) => ({
      ...prev,
      fileName: null,
      showMatrix: false,
    }));
  };

  const handleMatrixInputChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    row: number,
    col: number,
  ) => {
    e.preventDefault();
    if (activeBlock === null) return;

    // VALIDATE INPUT
    if (!isCrispInputValid(form.extension, e.target.value) || !isFuzzyInputValid(form.extension, e.target.value))
      return;

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...matrix];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return {
              ...c,
              value:
                idxx === col
                  ? form.extension === 'crisp'
                    ? convertCrispInput(e.target.value)
                    : convertFuzzyInput(e.target.value)
                  : c.value,
              error: false,
            };
          })
        : r;
    });

    setMatrix([...copy]);
    setForm({
      ...form,
      modified: true,
    });
  };

  const handleTypeChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number | undefined) => {
    if (col === undefined) return;
    const copy = [...criteriaTypes];
    copy[col] = event.target.value as string;
    setCriteriaTypes(copy);
    setForm({
      ...form,
      modified: copy[col] !== activeBlock?.data.criteriaTypes[col],
    });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: ['alternatives', 'criteria'].includes(event.target.name)
        ? +event.target.value
        : event.target.value,
      modified: event.target.value !== activeBlock?.data.extension,
    }));

    // CLEAR FILE
    if (event.target.name === 'extension' && activeBlock?.name === 'file') handleFileDelete();
  };

  // MATRIX FILE UPLOAD
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (form.extension) {
        const formData = new FormData();
        formData.append(
          'matrix',
          new Blob([e.target.files[0]], { type: e.target.files[0].type }),
          e.target.files[0].name,
        );
        formData.append('extension', form.extension);

        const response = await dispatch(uploadMatrixFile({ locale, body: formData }));
        if (response.meta.requestStatus === 'fulfilled') {
          if (fileError) setFileError(false);
          showSnackbar(t('snackbar:matrix-upload-success'), 'success');
          setMatrix(
            response.payload['matrix'].map((row: number[] | number[][]) =>
              row.map((col) => ({ value: `${col}`, error: false })),
            ),
          );
          setCriteriaTypes(response.payload['criteria_types'].map((c: number) => c.toString()));
          dispatch(resetConvertedMatrix());
          setForm({
            ...form,
            showMatrix: false,
            modified: true,
            ...(e.target.files[0]?.name !== null && { fileName: e.target.files[0].name }),
            ...(response.payload['matrix']?.length && { alternatives: response.payload['matrix']?.length }),
            ...(response.payload['criteria_types']?.length && { criteria: response.payload['criteria_types']?.length }),
          });
        } else {
          setFileError(true);
          setForm((prev) => ({
            ...prev,
            fileName: null,
            modified: false,
          }));
        }
      }
    }
  };

  // MATRIX GENERATION
  const handleGenerateMatrix = async () => {
    if (form.boundsError) return;

    setForm({
      ...form,
      generateDisable: true,
    });
    const response = await dispatch(
      generateMatrix({
        locale,
        body: {
          extension: form.extension,
          alternatives: form.alternatives,
          criteria: form.criteria,
          lower_bound: +form.lowerBound,
          upper_bound: +form.upperBound,
          precision: +form.precision,
        },
      }),
    );
    if (response.meta.requestStatus === 'fulfilled') {
      showSnackbar(t('snackbar:matrix-generated-success'), 'success');
      setMatrix(
        response.payload.matrix.map((row: number[][]) =>
          row.map((col: number[]) => ({ value: col.toString(), error: false })),
        ),
      );
      setCriteriaTypes(response.payload.criteria_types);
      setForm({
        ...form,
        generateDisable: false,
        modified: true,
      });
    } else {
      setForm({
        ...form,
        generateDisable: false,
      });
    }
  };

  const handleBoundsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isCrispInputValid('crisp', e.target.value)) return;

    const bounds = {
      lowerBound: form.lowerBound,
      upperBound: form.upperBound,
      [e.target.name]: e.target.value,
    };
    const boundsValidation = !validateMatrixBounds(bounds.lowerBound, bounds.upperBound);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      boundsError: boundsValidation,
      generateDisable: isGenerateDisabled(bounds.lowerBound, bounds.upperBound) || boundsValidation,
    });
  };

  const onMatrixBlur = (e: FocusEvent<HTMLInputElement>, row: number, col: number) => {
    let errorCode = 0;

    const errorMessages = {
      1: t('results:missing-decimal-value'),
      2: t('results:missing-three-values'),
      3: t('results:not-ascending-order'),
      4: t('results:missing-numerical-value'),
    };

    if (form.extension === 'crisp') {
      if (e.target.value.trim()[e.target.value.trim().length - 1] === '.') errorCode = 1;
    } else if (form.extension === 'fuzzy') {
      const splitted = e.target.value.split(',');
      if (splitted.some((i) => i.trim()[i.trim().length - 1] === '.')) errorCode = 1;
      // length other than 3 is error
      else if (splitted.length !== 3) errorCode = 2;
      // order not ascending is error
      const numbers = splitted.map((n: string) => +n);
      if (splitted.length === 3) {
        // check if values are given in ascending order or equal than previous value
        if (!numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1])) errorCode = 3;
        // not given numerical value for string
        if (splitted.some((i) => i.trim() === '')) errorCode = 4;
      }
    }

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...matrix];
    copy = copy.map((r, idx) => {
      return idx === row
        ? r.map((c, idxx) => {
            return {
              ...c,
              error: idxx === col ? errorCode !== 0 : c.error,
            };
          })
        : r;
    });

    setMatrix([...copy]);
    setForm({
      ...form,
      modified: true,
      matrixError: errorCode !== 0 ? errorMessages[errorCode] : null,
    });
  };

  const handleSave = () => {
    if (activeBlock === null) return;
    if (activeBlock.name === 'file' && form.fileName === null) {
      showSnackbar(t('snackbar:empty-input-matrix', { id: activeBlock.id }), 'error');
      return;
    }

    if (
      !validateMatrixData(
        matrix.map((r) => r.map((c) => c.value)),
        form.extension,
        activeBlock.id,
      )
    ) {
      return;
    }

    // SAVE MATRIX DATA
    dispatch(
      setBlockData({
        id: activeBlock.id,
        data: {
          extension: form.extension,
          alternatives: form.alternatives,
          criteria: form.criteria,
          matrix: matrix.map((r) => r.map((c) => c.value)),
          fileName: form.fileName,
          criteriaTypes: criteriaTypes,
        },
      }),
    );

    dispatch(
      setBlockError({
        id: activeBlock.id,
        error: getOutputConnections(activeBlock.id).length === 0,
      }),
    );
    dispatch(
      setBlockFilled({
        id: activeBlock.id,
        isFilled: true,
      }),
    );

    // IF CONNECTED WEIGHTS, UPDATE THE NUMBER OF CRITERIA IN THE DATA
    const weightsBlock = getMatrixWeightsConnections(blocks, connections, activeBlock);
    weightsBlock.forEach((b) => {
      if (getInputConnections(b.id).length === 1) {
        dispatch(
          setBlockCriteria({
            id: b.id,
            data: form.criteria,
          }),
        );
      }
    });

    closeModal();
  };

  const handleModalClose = () => {
    if (form.modified) {
      setModifiedModalOpen(true);
      return;
    }

    closeModal();
  };

  return (
    <ModalContainer
      title={t('results:matrix')}
      open={open}
      closeModal={handleModalClose}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
      errorText={matrix.flatMap((r) => r.map((c) => c.error)).includes(true) ? form.matrixError : undefined}
    >
      <>
        <Container>
          <Stack direction="column" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
            {/* EXTENSION AND NUMBER OF CRITERIA AND ALTERNATIVES */}
            <Stack direction="row" gap={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Select
                name="extension"
                label={t('results:extension') as string}
                items={extensionItems}
                value={form.extension}
                onChange={handleSelectChange}
                minWidth={200}
                required
              />
              {activeBlock !== null && activeBlock.name !== 'file' ? (
                <>
                  <Select
                    name="alternatives"
                    label={t('results:alternatives') as string}
                    items={alternativesItems}
                    value={`${form.alternatives}`}
                    onChange={handleSelectChange}
                    minWidth={100}
                    required
                  />
                  <Select
                    name="criteria"
                    label={t('results:criteria') as string}
                    items={criteriaItems}
                    value={`${form.criteria}`}
                    onChange={handleSelectChange}
                    minWidth={100}
                    required
                  />
                </>
              ) : null}
            </Stack>
            {/* RANDOM MATRIX SETTINGS */}
            {activeBlock !== null && activeBlock.name === 'random' ? (
              <Stack direction="row" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Input
                  name="lowerBound"
                  value={form.lowerBound}
                  label={t('results:lower-bound') as string}
                  onChange={(e) => handleBoundsChange(e)}
                  width={90}
                  min={0}
                  error={form.boundsError || `${form.lowerBound}` === ''}
                />
                <Input
                  name="upperBound"
                  value={form.upperBound}
                  label={t('results:upper-bound') as string}
                  onChange={(e) => handleBoundsChange(e)}
                  width={90}
                  min={1}
                  error={form.boundsError || `${form.upperBound}` === ''}
                />
                <Select
                  name="precision"
                  label={t('results:precision') as string}
                  items={precisionItems}
                  value={form.precision}
                  onChange={handleSelectChange}
                  minWidth={90}
                  required
                />
                <Button
                  variant="contained"
                  text={t('results:generate')}
                  onClick={handleGenerateMatrix}
                  disabled={form.generateDisable}
                />
              </Stack>
            ) : null}
          </Stack>
          {/* FILE TYPE */}
          {activeBlock !== null && activeBlock.name === 'file' ? (
            <>
              <FileUploader onUpload={handleFileChange} label={t('common:upload-files') as string} />
              {matrixLoading ? (
                <Container sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Loader size={100} />
                </Container>
              ) : form.fileName !== null ? (
                <Container>
                  <Stack direction="row" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Checkbox
                      name="showMatrix"
                      id="showMatrixCheckbox"
                      label={`${t('common:edit-uploaded-matrix')}`}
                      value={form.showMatrix}
                      onChange={(e) => setForm({ ...form, [e.target.name]: e.target.checked })}
                    />
                    <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Container disableGutters sx={{ pr: 1 }}>
                        <Typography align="right">{t('common:uploaded-file')} </Typography>
                        <Typography align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                          {convertTextLength(form.fileName)}
                        </Typography>
                      </Container>
                      <DeleteIcon onClick={handleFileDelete} sx={{ cursor: 'pointer', color: 'error.main' }} />
                    </Stack>
                  </Stack>
                </Container>
              ) : fileError ? (
                <Typography textAlign="center" sx={{ color: 'error.main' }}>
                  {t('snackbar:matrix-upload-error')}
                </Typography>
              ) : null}
            </>
          ) : null}
          {/* INPUT MATRIX */}
          {activeBlock !== null && (['input', 'random'].includes(activeBlock.name) || form.showMatrix) ? (
            <Box mt={2}>
              {matrixLoading ? (
                <Container sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Loader size={100} />
                </Container>
              ) : (
                <Stack direction="row" gap={1}>
                  <InputMatrix
                    matrix={matrix}
                    alternatives={form.alternatives}
                    criteria={form.criteria}
                    extension={form.extension}
                    onChange={handleMatrixInputChange}
                    criteriaTypes={criteriaTypes}
                    onCriteriaTypeChange={handleTypeChange}
                    onMatrixBlur={onMatrixBlur}
                  />
                </Stack>
              )}
            </Box>
          ) : null}
        </Container>
        <ModificationModal
          open={modifiedModalOpen}
          closeModal={() => setModifiedModalOpen(false)}
          confirmModal={() => {
            setModifiedModalOpen(false);
            closeModal();
          }}
        />
      </>
    </ModalContainer>
  );
}

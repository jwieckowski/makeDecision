import { useState, ChangeEvent, FocusEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Divider } from '@mui/material';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// COMPONENTS
import Input from '@/components/Input';
import ModalContainer from '../ModalContainer';
import ModificationModal from '../ModificationModal';

// CONST
import { DEFAULT_CRITERIA, MAX_CRITERIA } from '@/common/const';

// UTILS
// import useCalculation from '@/utils/calculation';
import useValidation from '@/utils/validation';
import { convertCrispInput, convertFuzzyInput } from '@/utils/formatting';
import { setBlockWeights, setBlockError } from '@/state/slices/blocksSlice';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

type WeightsCellProps = {
  value: string;
  error: boolean;
};

type FormProps = {
  userWeights: WeightsCellProps[];
  modified: boolean;
  modifiedModalOpen: boolean;
};

export default function WeightsModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isCrispInputValid, isFuzzyInputValid, isUserInputWeightsDataValid } = useValidation();

  const [form, setForm] = useState<FormProps>({
    userWeights:
      activeBlock !== null && activeBlock?.data.weights.length > 0
        ? activeBlock?.data.weights.map((i) => ({ value: i, error: false }))
        : Array(activeBlock?.data?.criteria ?? DEFAULT_CRITERIA)
            .fill(`0`)
            .map((i) => ({ value: i, error: false })),
    modified: false,
    modifiedModalOpen: false,
  });

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) {
    e.preventDefault();
    if (activeBlock === null) return;

    // VALIDATE INPUT
    if (
      !isCrispInputValid(activeBlock.data.extension, e.target.value) ||
      !isFuzzyInputValid(activeBlock.data.extension, e.target.value)
    )
      return;

    // COPY WEIGHTS AND CHANGE SINGLE VALUE
    let copy = [...form.userWeights];
    copy = copy.map((w, idx) => {
      return idx === col
        ? {
            ...w,
            value:
              activeBlock?.data.extension === 'crisp'
                ? convertCrispInput(e.target.value)
                : convertFuzzyInput(e.target.value),
            error: false,
          }
        : w;
    });

    setForm({
      ...form,
      userWeights: copy,
      modified: copy[col].value !== activeBlock?.data.weights[col],
    });
  }

  const handleModalClose = () => {
    if (form.modified) {
      setForm({ ...form, modifiedModalOpen: true });
      return;
    }

    closeModal();
  };

  const handleSave = () => {
    if (activeBlock === null) return;
    if (
      !isUserInputWeightsDataValid(
        form.userWeights.map((i) => i.value),
        activeBlock.data.extension,
        activeBlock.id,
      )
    ) {
      return;
    }

    // SAVE WEIGHTS DATA
    dispatch(setBlockWeights({ id: activeBlock?.id, data: form.userWeights.map((i) => i.value) }));
    dispatch(
      setBlockError({
        id: activeBlock.id,
        error: false,
      }),
    );

    closeModal();
  };

  const onWeightsBlur = (e: FocusEvent<HTMLInputElement>, col: number) => {
    if (activeBlock === null) return;

    let isError = false;
    if (activeBlock?.data.extension === 'crisp') {
      isError = e.target.value[e.target.value.length - 1] === '.';
    } else if (activeBlock.data.extension === 'fuzzy') {
      const splitted = e.target.value.split(',');
      // length other than 3 is error
      isError = splitted.length !== 3;
      // order not ascending is error
      const numbers = splitted.map((n: string) => +n);
      if (splitted.length === 3) {
        // check if values are given in ascending order or equal than previous value
        isError = !numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1]);
        // not given numerical value for string
        isError = splitted.some((i) => i.trim() === '');
      }
    }

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...form.userWeights];
    copy = copy.map((c, idx) => {
      return idx === col
        ? {
            ...c,
            error: isError,
          }
        : c;
    });

    setForm((prev) => ({
      ...prev,
      userWeights: [...copy],
      modified: true,
    }));
  };

  return (
    <ModalContainer
      title={t('results:weights')}
      open={open}
      closeModal={handleModalClose}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
      errorText={form.userWeights.map((c) => c.error).includes(true) ? t('results:weights-error') : undefined}
    >
      <>
        <Container maxWidth="sm">
          <Stack direction="column" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
            {activeBlock !== null ? (
              <Stack
                direction="row"
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: activeBlock.data.criteria < 6 ? 'center' : 'start',
                }}
              >
                {Array(activeBlock.data.criteria <= MAX_CRITERIA ? activeBlock?.data.criteria : MAX_CRITERIA)
                  .fill(0)
                  .map((_, col) => {
                    return (
                      <div key={`row-${col}`}>
                        <Input
                          type="string"
                          value={
                            col < form.userWeights.length
                              ? form.userWeights[col].value
                              : activeBlock.data.extension === 'crisp'
                              ? '0'
                              : '0, 0, 0'
                          }
                          label={`C${col + 1}`}
                          onChange={(e) => handleInputChange(e, col)}
                          textCenter
                          error={
                            form.userWeights.length && form.userWeights.length === activeBlock.data.criteria
                              ? form.userWeights[col]?.error
                              : false
                          }
                          onBlur={(e) => onWeightsBlur(e, col)}
                        />
                      </div>
                    );
                  })}
              </Stack>
            ) : null}
          </Stack>
        </Container>
        <ModificationModal
          open={form.modifiedModalOpen}
          closeModal={() => setForm((prev) => ({ ...prev, modifiedModalOpen: false }))}
          confirmModal={() => {
            setForm((prev) => ({ ...prev, modifiedModalOpen: false }));
            closeModal();
          }}
        />
      </>
    </ModalContainer>
  );
}

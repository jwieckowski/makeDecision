import { useState, useEffect, ChangeEvent, FocusEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Divider } from '@mui/material';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// COMPONENTS
import Input from '@/components/Input';
import Select from '@/components/Select';
import ModalContainer from '../ModalContainer';
import ModificationModal from '../ModificationModal';

// CONST
import { DEFAULT_ALTERNATIVES, MIN_ALTERNATIVES, MAX_ALTERNATIVES } from '@/common/calculations';

// UTILS
import useValidation from '@/utils/validation';
import { convertCrispInput } from '@/utils/formatting';
import { setBlockError, setBlockData } from '@/state/slices/blocksSlice';

type ModalProps = {
  open: boolean;
  type: 'preferences' | 'ranking';
  closeModal: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

type InputCellProps = {
  value: string;
  error: boolean;
};

type FormProps = {
  alternatives: number;
  userInput: InputCellProps[];
  modified: boolean;
  modifiedModalOpen: boolean;
};

export default function UserInputModal({ open, type, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isCrispInputValid } = useValidation();

  const [form, setForm] = useState<FormProps>({
    userInput:
      activeBlock !== null && activeBlock?.data.preference.length > 0
        ? activeBlock?.data.preference.map((i) => ({ value: i, error: false }))
        : Array(activeBlock?.data?.alternatives ?? DEFAULT_ALTERNATIVES)
            .fill(`0`)
            .map((i) => ({ value: i, error: false })),
    modified: false,
    modifiedModalOpen: false,
    alternatives: activeBlock?.data?.alternatives || DEFAULT_ALTERNATIVES,
  });

  const alternativesItems = useMemo(
    () =>
      Array(MAX_ALTERNATIVES - MIN_ALTERNATIVES)
        .fill(0)
        .map((_, i) => ({ label: `${i + 1 + MIN_ALTERNATIVES}`, value: `${i + 1 + MIN_ALTERNATIVES}` })),
    [],
  );

  // ALTERNATIVES EFFECTS
  useEffect(() => {
    if (form.alternatives < MIN_ALTERNATIVES || form.alternatives > MAX_ALTERNATIVES) return;

    const value = '0';

    // FILL INPUT WITH VALUES
    if (form.alternatives > 0) {
      let copy = Array(form.alternatives <= MAX_ALTERNATIVES ? form.alternatives : MAX_ALTERNATIVES)
        .fill(null)
        .map(() => ({ value, error: false }));

      if (form.userInput.length > 0) {
        copy = copy.map((r, idx) => {
          return {
            ...r,
            value: idx < form.userInput.length ? `${form.userInput[idx].value}` : r.value,
          };
        });
      }

      setForm((prev) => ({
        ...prev,
        userInput: copy,
      }));
    }
  }, [form.alternatives]);

  function handleCellInputChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) {
    e.preventDefault();
    if (activeBlock === null) return;

    // VALIDATE INPUT
    if (!isCrispInputValid(activeBlock.data.extension, e.target.value)) return;
    if (type === 'ranking' && e.target.value.includes('.')) return;

    // COPY INPUT AND CHANGE SINGLE VALUE
    let copy = [...form.userInput];
    copy = copy.map((w, idx) => {
      return idx === col
        ? {
            ...w,
            value: convertCrispInput(e.target.value),
            error: false,
          }
        : w;
    });

    setForm({
      ...form,
      userInput: [...copy],
      modified: copy[col].value !== activeBlock?.data.preference[col],
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

    // SAVE INPUT DATA
    dispatch(
      setBlockData({
        id: activeBlock?.id,
        data: {
          alternatives: form.alternatives,
          preference: form.userInput.map((i) => i.value),
        },
      }),
    );

    closeModal();
  };

  const handleSelectChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: +event.target.value,
      modified: +event.target.value !== activeBlock?.data.alternatives,
    }));
  };

  const onInputBlur = (e: FocusEvent<HTMLInputElement>, col: number) => {
    if (activeBlock === null) return;

    let isError = false;
    if (activeBlock?.data.extension === 'crisp') {
      isError = e.target.value[e.target.value.length - 1] === '.';
    }

    // COPY MATRIX AND CHANGE SINGLE VALUE
    let copy = [...form.userInput];
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
      userInput: [...copy],
      modified: copy[col].value !== activeBlock?.data.preference[col],
    }));
  };

  const getModalContainerError = () => {
    if (!form.userInput.map((c) => c.error).includes(true)) return undefined;
    return type === 'ranking' ? t('results:preference-error') : t('results:ranking-error');
  };

  return (
    <ModalContainer
      title={t(`results:${type}`)}
      open={open}
      closeModal={handleModalClose}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
      errorText={getModalContainerError()}
    >
      <>
        <Container maxWidth="sm" sx={{ minWidth: '450px' }}>
          <Stack direction="column" gap={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
            <Stack direction="row" gap={1} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Select
                name="alternatives"
                label={t('results:alternatives') as string}
                items={alternativesItems}
                value={`${form.alternatives}`}
                onChange={handleSelectChange}
                minWidth={100}
                required
              />
            </Stack>

            {activeBlock !== null ? (
              <Stack
                direction="row"
                style={{
                  width: form.alternatives < 6 ? '100%' : '85%',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: form.alternatives < 6 ? 'center' : 'start',
                  margin: form.alternatives < 6 ? 0 : 'auto',
                }}
              >
                {Array(form.alternatives <= MAX_ALTERNATIVES ? form.alternatives : MAX_ALTERNATIVES)
                  .fill(0)
                  .map((_, col) => {
                    return (
                      <div key={`row-${col}`}>
                        <Input
                          type="string"
                          value={col < form.userInput.length ? form.userInput[col].value : '0'}
                          label={`A${col + 1}`}
                          onChange={(e) => handleCellInputChange(e, col)}
                          textCenter
                          error={
                            form.userInput.length && form.userInput.length === activeBlock.data.alternatives
                              ? form.userInput[col]?.error
                              : false
                          }
                          min={0}
                          onBlur={(e) => onInputBlur(e, col)}
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

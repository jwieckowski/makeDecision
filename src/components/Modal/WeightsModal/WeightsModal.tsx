import { useState, ChangeEvent } from 'react';
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

export default function WeightsModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { validateCrispInput, validateFuzzyInput, validateUserInputWeightsData } = useValidation();

  const [userWeights, setUserWeights] = useState<string[]>(
    activeBlock !== null && activeBlock?.data.weights.length > 0
      ? activeBlock?.data.weights
      : Array(activeBlock?.data?.criteria ?? DEFAULT_CRITERIA).fill(`0`),
  );
  const [modified, setModified] = useState<boolean>(false);
  const [modifiedModalOpen, setModifiedModalOpen] = useState<boolean>(false);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) {
    e.preventDefault();
    if (activeBlock === null) return;

    // VALIDATE INPUT
    if (
      !validateCrispInput(activeBlock.data.extension, e.target.value) ||
      !validateFuzzyInput(activeBlock.data.extension, e.target.value)
    )
      return;

    // COPY WEIGHTS AND CHANGE SINGLE VALUE
    let copy = [...userWeights];
    copy = copy.map((w, idx) => {
      return idx === col
        ? activeBlock?.data.extension === 'crisp'
          ? convertCrispInput(e.target.value)
          : convertFuzzyInput(e.target.value)
        : w;
    });

    setUserWeights(copy);
    setModified(true);
    console.log(copy, activeBlock.data.weights);
    if (copy[col] === activeBlock?.data.weights[col]) setModified(false);
  }

  const handleModalClose = () => {
    if (modified) {
      setModifiedModalOpen(true);
      return;
    }

    closeModal();
  };

  const handleSave = () => {
    if (activeBlock === null) return;
    if (!validateUserInputWeightsData(userWeights, activeBlock.data.extension, activeBlock.id)) {
      return;
    }

    // SAVE WEIGHTS DATA
    dispatch(setBlockWeights({ id: activeBlock?.id, data: userWeights }));
    dispatch(
      setBlockError({
        id: activeBlock.id,
        error: false,
      }),
    );

    closeModal();
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
                            col < userWeights.length
                              ? userWeights[col]
                              : activeBlock.data.extension === 'crisp'
                              ? '0'
                              : '0, 0, 0'
                          }
                          label={`C${col + 1}`}
                          onChange={(e) => handleInputChange(e, col)}
                          textCenter
                        />
                      </div>
                    );
                  })}
              </Stack>
            ) : null}
          </Stack>
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

import { useState, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent, Container, Stack, Typography, Divider, Box } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';
import { setBlockError, setBlockKwargs } from '@/state/slices/blocksSlice';

// TYPES
import { MethodsKwargsValueType } from '@/types';

// HOOKS
import { useLocale } from '@/hooks';

// API
import { getKwargsItems } from '@/api/calculations';

// COMPONENTS
import ModalContainer from '../ModalContainer';
import ModificationModal from '../ModificationModal';
import Select from '@/components/Select';
import Input from '@/components/Input';
import ArrayInput from '@/components/Array';
import Checkbox from '@/components/Checkbox';

import { CValues, Bounds, ESPInput } from '@/components/ArrayInputs';

// UTILS
import useBlocksConnection from '@/utils/connections';

// CONST
import { MIN_CRITERIA, STEP_CURVENESS_VALUE } from '@/common/const';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

type MatricesProps = {
  id: number;
  extension: string;
};

type KwargsItemsValueProps = MethodsKwargsValueType & {
  value: string;
  arrayShow?: boolean;
};

type KwargsItemsProps = {
  matrixId: number;
  extension: string;
  data: KwargsItemsValueProps[];
};

export default function MethodModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const { methodsKwargsItems } = useAppSelector((state) => state.calculation);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const [modified, setModified] = useState<boolean>(false);
  const [modifiedModalOpen, setModifiedModalOpen] = useState<boolean>(false);
  const [kwargsItems, setKwargsItems] = useState<KwargsItemsProps[]>([]);

  const getMethodItems = async () => {
    if (activeBlock === null || activeBlock.typeKwargs.length === 0) return;
    let items: MethodsKwargsValueType[] = [];
    if (!Object.keys(methodsKwargsItems).includes(activeBlock.name.toUpperCase())) {
      await dispatch(getKwargsItems({ locale: locale, method: activeBlock.name.toUpperCase() })).then((response) => {
        items = response.payload[activeBlock.name.toUpperCase()];
      });
    } else {
      items = methodsKwargsItems[activeBlock.name.toUpperCase()];
    }

    const methodExtensions: MatricesProps[] = getMethodsConnectedBlocksExtensions(activeBlock);

    const methodItems = methodExtensions.map((ext) => {
      const blockMatrixKwargs = activeBlock.data.kwargs.find((kwargs) => kwargs.matrixId === ext.id);
      return {
        data: [
          ...items
            .filter((item) => item.extension == ext.extension)
            .map((item, idx) => {
              return {
                ...item,
                value: blockMatrixKwargs?.data[idx].value ?? item.default,
                ...(item?.required && { arrayShow: item.required }),
              };
            }),
        ],
        matrixId: ext.id,
        extension: ext.extension,
      };
    });

    setKwargsItems(methodItems);
  };

  console.log(kwargsItems);

  useEffect(() => {
    getMethodItems();
  }, []);

  const handleSelectKwargChange = (e: SelectChangeEvent, idx: number, i: number) => {
    if (activeBlock?.data?.kwargs[idx]?.data[i]?.value === e.target.value) {
      setModified(false);
    } else setModified(true);

    const copy = [...kwargsItems];
    copy[idx].data[i] = { ...copy[idx].data[i], value: e.target.value };
    setKwargsItems(copy);
  };

  const handleInputKwargChange = (e: ChangeEvent<HTMLInputElement>, idx: number, i: number) => {
    if (activeBlock?.data?.kwargs[idx]?.data[i]?.value === e.target.value) {
      setModified(false);
    } else setModified(true);

    const copy = [...kwargsItems];
    copy[idx].data[i] = { ...copy[idx].data[i], value: e.target.value };
    setKwargsItems(copy);
  };

  const handleArrayShowClick = (e: ChangeEvent<HTMLInputElement>, idx: number, i: number) => {
    const copy = [...kwargsItems];
    copy[idx].data[i] = { ...copy[idx].data[i], arrayShow: e.target.checked };
    setKwargsItems(copy);
  };

  const isArrayRequired = (kwargsData: KwargsItemsValueProps[]) => {
    return kwargsData[0].parameter === 'preference_function' && kwargsData[0].value !== kwargsData[0].default;
  };

  const showArrayParam = (kwargsData: KwargsItemsValueProps[], idx: number) => {
    return isArrayRequired(kwargsData) || kwargsData[idx]?.arrayShow || false;
  };

  // const getArrayContent = (label: string) => {
  //   switch (label.toLowerCase()) {
  //     case 'characteristic values':
  //       return <CValues />;
  //     case 'esp':
  //     case 'reference ideal':
  //     case 'reference points':
  //       return <ESPInput />;
  //     case 'bounds':
  //       return <Bounds />;
  //     default:
  //       return null;
  //   }
  // };

  const handleModalClose = () => {
    if (modified) {
      setModifiedModalOpen(true);
      return;
    }

    closeModal();
  };

  const handleSave = () => {
    if (activeBlock === null) return;

    const data = kwargsItems.map((item) => {
      return {
        matrixId: item.matrixId,
        data: [
          ...item.data.map((i) => {
            return {
              parameter: i.parameter,
              value: i.value,
            };
          }),
        ],
      };
    });

    dispatch(setBlockKwargs({ id: activeBlock.id, data }));

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
      title={t('results:method')}
      open={open}
      closeModal={handleModalClose}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
    >
      <>
        <Container maxWidth="md">
          <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
          {kwargsItems.map((kwargs, idx) => {
            return (
              <Accordion
                defaultExpanded={idx === 0}
                key={idx}
                sx={{ bgcolor: 'secondary.light', px: 2, mt: 1, borderRadius: 2, boxShadow: '0 4px 2px -2px gray' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="matrix-accordion"
                  id={`matrix-accordion-${idx}`}
                >
                  <Typography>
                    {t('results:matrix')} ID {kwargs.matrixId} ({kwargs.extension.toLowerCase()})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {kwargs.data.length > 0 ? (
                    <Stack
                      gap={3}
                      p={2}
                      direction="column"
                      alignItems="center"
                      sx={{ bgcolor: 'white', borderRadius: 2 }}
                    >
                      {kwargs.data.map((kwargItem, i) => {
                        return (
                          <Box key={`parameter-wrapper-${idx}-${i}`} sx={{ maxWidth: '600px' }}>
                            {['select', 'bool'].includes(kwargItem.type) && kwargItem.items ? (
                              <Select
                                key={`parameter-${idx}-${i}`}
                                label={kwargItem.label.toUpperCase()}
                                items={kwargItem.items}
                                value={kwargItem.value}
                                onChange={(e) => handleSelectKwargChange(e, idx, i)}
                                minWidth={200}
                              />
                            ) : null}
                            {kwargItem.type === 'input' ? (
                              <Input
                                key={`parameter-${idx}-${i}`}
                                type={'number'}
                                value={kwargItem.value}
                                label={kwargItem.label.toUpperCase()}
                                onChange={(e) => handleInputKwargChange(e, idx, i)}
                                width={200}
                                min={kwargItem.min ?? 0}
                                max={kwargItem?.max}
                                step={STEP_CURVENESS_VALUE}
                              />
                            ) : null}
                            {kwargItem.type === 'array' ? (
                              <>
                                {kwargItem?.required ? (
                                  <Typography align="center">{kwargItem.label.toUpperCase()}</Typography>
                                ) : (
                                  <Checkbox
                                    id="arrayCheckbox"
                                    label={kwargItem.label.toUpperCase()}
                                    // value={kwargItem?.arrayShow ?? false}
                                    value={showArrayParam(kwargs.data, i)}
                                    onChange={(e) => handleArrayShowClick(e, idx, i)}
                                    placement="start"
                                    disabled={isArrayRequired(kwargs.data)}
                                  />
                                )}
                                {showArrayParam(kwargs.data, i) ? (
                                  <ArrayInput
                                    key={`parameter-${idx}-${i}`}
                                    criteria={activeBlock?.data.criteria ?? MIN_CRITERIA}
                                    dimension={kwargItem?.dimension ?? 1}
                                    onChange={(e) => {}}
                                    values={[]}
                                    min={kwargItem?.min}
                                    max={kwargItem?.max}
                                  />
                                ) : null}
                              </>
                            ) : null}
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : null}
                </AccordionDetails>
              </Accordion>
            );
          })}
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

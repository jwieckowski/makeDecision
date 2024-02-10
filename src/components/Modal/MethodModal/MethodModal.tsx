// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent, Container, Stack, Typography, Divider, Box } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';
import { setBlockError, setBlockKwargs, setBlockFilled } from '@/state/slices/blocksSlice';

// TYPES
import { MethodsKwargsValueType, BlockDataKwargsType } from '@/types';

// HOOKS
import { useLocale } from '@/hooks';

// API
import { getKwargsItems } from '@/api/calculations';

// COMPONENTS
import ModalContainer from '../ModalContainer';
import ModificationModal from '../ModificationModal';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';
import Loader from '@/components/Loader';

import ArrayParams from './ArrayParams';

// UTILS
import useBlocksConnection from '@/utils/connections';

// CONST
import { STEP_CURVENESS_VALUE } from '@/common/ui';

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
  value: string | string[] | string[][];
  arrayShow?: boolean;
};

type KwargsItemsProps = {
  matrixId: number;
  extension: string;
  data: KwargsItemsValueProps[];
};

export default function MethodModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { activeBlock } = useAppSelector((state) => state.blocks);
  const { methodsKwargsItems, kwargsLoading, error } = useAppSelector((state) => state.calculation);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const [modified, setModified] = useState<boolean>(false);
  const [modifiedModalOpen, setModifiedModalOpen] = useState<boolean>(false);
  const [kwargsItems, setKwargsItems] = useState<KwargsItemsProps[]>([]);

  const isCometEspRequired = (blockData: BlockDataKwargsType | undefined) => {
    if (!blockData) return false;
    if (activeBlock === null || activeBlock.name.toUpperCase() !== 'COMET' || activeBlock.data.kwargs.length === 0)
      return false;
    return blockData.data[0].value == 'esp_expert';
  };

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

    if (!items || items.length === 0) {
      closeModal();
      return;
    }

    const methodExtensions: MatricesProps[] = getMethodsConnectedBlocksExtensions(activeBlock);

    const methodItems = methodExtensions
      .map((ext) => {
        const blockMatrixKwargs = activeBlock.data.kwargs.find((kwargs) => kwargs.matrixId === ext.id);
        return {
          data: [
            ...items
              .filter((item) => item.extension == ext.extension)
              .map((item, idx) => {
                return {
                  ...item,
                  value: blockMatrixKwargs?.data[idx].value ?? item.default,
                  ...(item?.required === false &&
                    isCometEspRequired(blockMatrixKwargs) && {
                      required: true,
                    }),
                  ...(item?.required && { arrayShow: item.required }),
                };
              }),
          ],
          matrixId: ext.id,
          extension: ext.extension,
        };
      })
      .filter((item) => item.data.length > 0);

    setKwargsItems(methodItems);
  };

  useEffect(() => {
    getMethodItems();
  }, []);

  const handleSelectKwargChange = (e: SelectChangeEvent, idx: number, i: number) => {
    if (activeBlock?.data?.kwargs[idx]?.data[i]?.value === e.target.value) {
      setModified(false);
    } else setModified(true);

    const copy = [...kwargsItems];
    copy[idx].data[i] = { ...copy[idx].data[i], value: e.target.value };

    if (e.target.value === 'esp_expert') {
      copy[idx].data[1] = {
        ...copy[idx].data[1],
        required: true,
      };
    } else if (['method_expert', 'compromise_expert'].includes(e.target.value) && copy[idx].data.length > 1) {
      copy[idx].data[1] = {
        ...copy[idx].data[1],
        required: false,
      };
    }
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
    copy[idx].data[i] = { ...copy[idx].data[i], arrayShow: e.target.checked, value: kwargsItems[idx].data[i].default };
    setKwargsItems(copy);
  };

  const isArrayRequired = (kwargsData: KwargsItemsValueProps[]) => {
    return kwargsData[0].parameter === 'preference_function' && kwargsData[0].value !== kwargsData[0].default;
  };

  const showArrayParam = (kwargsData: KwargsItemsValueProps[], idx: number) => {
    return (
      isArrayRequired(kwargsData) ||
      kwargsData[idx]?.arrayShow ||
      kwargsData[idx].value !== kwargsData[idx].default ||
      false
    );
  };

  const isShowKwargItemIndependent = (idx: number) => {
    if (activeBlock?.name.toUpperCase() !== 'COMET') return true;

    // COMET ESP
    return kwargsItems[idx].data[0].value === 'esp_expert';
  };

  const handleArrayInputChange = (arrayValues: string[][], kwargId: number, paramId: number) => {
    const copy = [...kwargsItems];

    // DISTINCT IF ONE OR TWO DIMENSIONAL PARAMETER
    copy[kwargId].data[paramId] = {
      ...copy[kwargId].data[paramId],
      value: arrayValues.length === 1 ? arrayValues[0] : arrayValues,
    };

    setKwargsItems(copy);
  };

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
              value: i?.arrayShow === undefined ? i.value : i.arrayShow ? i.value : i.default,
            };
          }),
        ],
      };
    });

    dispatch(setBlockKwargs({ id: activeBlock.id, data }));

    let filled = true;
    if (
      (activeBlock.name.toLowerCase() === 'comet' &&
        kwargsItems.filter((item) => item.data[0].value === 'esp_expert' && item.data[1].value.length === 0).length >
          0) ||
      (['rim', 'spotis'].includes(activeBlock.name.toLowerCase()) &&
        kwargsItems.filter((item) => item.data[0].value.length === 0).length > 0)
    ) {
      filled = false;
    }

    dispatch(
      setBlockFilled({
        id: activeBlock.id,
        isFilled: filled,
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
          {kwargsLoading ? (
            <Container sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <Loader size={80} />
            </Container>
          ) : !error ? (
            <>
              <Divider textAlign="center">{activeBlock?.name.toUpperCase()}</Divider>
              {kwargsItems.map((kwargs, idx) => {
                return (
                  <Accordion
                    defaultExpanded={idx === 0}
                    key={idx}
                    sx={{ border: '2px solid gray', borderRadius: 2, boxShadow: '0 4px 2px -2px gray', px: 2, mt: 1 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="matrix-accordion"
                      id={`matrix-accordion-${idx}`}
                    >
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {t('results:matrix').toUpperCase()} (ID {kwargs.matrixId} - {kwargs.extension.toLowerCase()})
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
                                    value={kwargItem.value as string}
                                    onChange={(e) => handleSelectKwargChange(e, idx, i)}
                                    minWidth={200}
                                  />
                                ) : null}
                                {kwargItem.type === 'input' ? (
                                  <Input
                                    key={`parameter-${idx}-${i}`}
                                    type={'number'}
                                    value={kwargItem.value as string}
                                    label={kwargItem.label.toUpperCase()}
                                    onChange={(e) => handleInputKwargChange(e, idx, i)}
                                    width={200}
                                    min={kwargItem.min ?? 0}
                                    max={kwargItem?.max}
                                    step={STEP_CURVENESS_VALUE}
                                  />
                                ) : null}
                                {kwargItem.type === 'array' && isShowKwargItemIndependent(idx) ? (
                                  <>
                                    {kwargItem?.required ? (
                                      <Typography align="center">{kwargItem.label.toUpperCase()}</Typography>
                                    ) : (
                                      <Checkbox
                                        id="arrayCheckbox"
                                        label={kwargItem.label.toUpperCase()}
                                        value={showArrayParam(kwargs.data, i)}
                                        onChange={(e) => handleArrayShowClick(e, idx, i)}
                                        placement="start"
                                        disabled={isArrayRequired(kwargs.data)}
                                      />
                                    )}
                                    {kwargItem?.required || showArrayParam(kwargs.data, i) ? (
                                      <ArrayParams
                                        label={kwargItem.label}
                                        matrixId={kwargs.matrixId}
                                        values={kwargItem.value !== '' ? (kwargItem.value as string[]) : []}
                                        onChange={handleArrayInputChange}
                                        kwargId={idx}
                                        paramId={i}
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
            </>
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

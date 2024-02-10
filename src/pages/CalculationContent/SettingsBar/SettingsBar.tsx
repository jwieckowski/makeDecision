import { useTranslation } from 'react-i18next';
import { Paper, Stack, Grid } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// API
import { getResults } from '@/api/calculations';

// TYPES
import { StructureErrorItem } from '@/types';

// SLICES
import { clearBody, resetBody, resetResults, setErrorModalOpen, setErrorsList } from '@/state/slices/calculationSlice';
import { setBlocks, setActiveBlock } from '@/state/slices/blocksSlice';

// HOOKS
import { useLocale, useConnectionList } from '@/hooks';

// COMPONENTS
import Button from '@/components/Button';
import DragSettings from './DragSettings';

// UTILS
// import { printDocument, generateResultsFile } from '@/utils/files';
import useCalculation from '@/utils/calculation';

export default function SettingsBar() {
  const { blocks } = useAppSelector((state) => state.blocks);
  // const { results } = useAppSelector((state) => state.calculation);

  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { getCalculationBody } = useCalculation();
  const { connections, clearListNodes, setClickedListItems, getStructureErrors } = useConnectionList();

  const handleClearClick = () => {
    setClickedListItems([]);
    dispatch(setActiveBlock(null));
    dispatch(setBlocks([]));
    dispatch(resetResults());
    dispatch(resetBody());
    clearListNodes();
  };

  const handleCalculateClick = async () => {
    dispatch(clearBody());

    let errors: StructureErrorItem[] = [];

    if (blocks.length === 0) {
      errors = [{ id: null, type: null, message: t('snackbar:no-input-data') }];
    } else {
      // check for minimum block structure
      const minStructure = ['matrix', 'weights'];
      const blocksType = blocks.map((block) => block.type);
      const isMinStructure = minStructure.every((value) => blocksType.includes(value));
      if (!isMinStructure) {
        errors = [{ id: null, type: null, message: t('snackbar:structure-missing') }];
      }
    }

    errors = [...errors, ...getStructureErrors()];
    if (errors.length > 0) {
      await dispatch(setErrorsList(errors));
      await dispatch(setErrorModalOpen(true));
      return;
    } else {
      await dispatch(setErrorsList([]));
      await dispatch(setErrorModalOpen(false));
    }

    setTimeout(async () => {
      const data = getCalculationBody(blocks, connections);
      console.log(data);
      await dispatch(
        getResults({
          locale,
          params: {
            data: data,
          },
        }),
      );
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: { md: 'center', lg: 'space-between' },
        gap: '8px',
        px: 3,
        py: 1,
        borderRadius: 0,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={8} md={9}>
          <DragSettings />
        </Grid>
        <Grid item xs={4} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack direction="row" gap={2} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              text={t('results:clear')}
              onClick={handleClearClick}
              startIcon={<HighlightOffIcon />}
              variant="contained"
              width={130}
            />
            <Button
              text={t('results:calculate')}
              onClick={handleCalculateClick}
              startIcon={<PlayCircleOutlineIcon />}
              variant="contained"
              width={130}
            />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

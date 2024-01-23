import { useTranslation } from 'react-i18next';
import { Paper, Stack, Grid } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// API
import { getResults } from '@/api/calculations';

// SLICES
import { clearBody, resetBody, resetResults } from '@/state/slices/calculationSlice';
import { setBlocks, setClickedBlocks, setConnections, setActiveBlock, setBlockError } from '@/state/slices/blocksSlice';

// HOOKS
import { useLocale } from '@/hooks';

// COMPONENTS
import Button from '@/components/Button';
import DragSettings from './DragSettings';

// UTILS
// import { printDocument, generateResultsFile } from '@/utils/files';
import useCalculation from '@/utils/calculation';
import { getNotConnectedBlocks } from '@/utils/blocks';
import useSnackbars from '@/utils/snackbars';

export default function SettingsBar() {
  const { blocks, connections } = useAppSelector((state) => state.blocks);
  // const { results } = useAppSelector((state) => state.calculation);

  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { getCalculationBody } = useCalculation();
  const { showSnackbar } = useSnackbars();

  const handleClearClick = () => {
    dispatch(setClickedBlocks([]));
    dispatch(setActiveBlock(null));
    dispatch(setConnections([]));
    dispatch(setBlocks([]));
    dispatch(resetResults());
    dispatch(resetBody());
  };

  const handleCalculateClick = async () => {
    dispatch(clearBody());
    if (blocks.length === 0) {
      showSnackbar(t('snackbar:no-input-data'), 'error');
      return;
    }

    // check if some blocks have not filled data
    const notFilledBlocks = blocks.filter((block) => block.error);
    if (notFilledBlocks.length > 0) {
      showSnackbar(t('snackbar:not-filled-blocks'), 'error');
      return;
    }

    // check for minimum block structure
    const minStructure = ['matrix', 'weights'];
    const blocksType = blocks.map((block) => block.type);
    const isMinStructure = minStructure.every((value) => blocksType.includes(value));
    if (!isMinStructure) {
      showSnackbar(t('snackbar:structure-missing'), 'error');
      return;
    }

    // show added but not connected blocks
    const notConnectedBlocks = getNotConnectedBlocks(blocks, connections);
    if (notConnectedBlocks.length > 0) {
      notConnectedBlocks.forEach((b) => {
        dispatch(
          setBlockError({
            id: b.id,
            error: true,
          }),
        );
      });
      showSnackbar(t('snackbar:not-connected-blocks'), 'error');
      return;
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

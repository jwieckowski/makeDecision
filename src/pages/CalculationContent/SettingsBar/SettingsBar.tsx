import { useTranslation } from 'react-i18next';
import { Paper, Stack, Divider } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// API
import { getResults } from '@/api/calculations';

// SLICES
import { clearBody, resetBody, resetResults, setCalculationMatrixId } from '@/state/slices/calculationSlice';
import {
  setBlocks,
  setClickedBlocks,
  setConnections,
  setActiveBlock,
  setBlockStyles,
} from '@/state/slices/blocksSlice';

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
  const { allMethods } = useAppSelector((state) => state.dictionary);
  // const { results } = useAppSelector((state) => state.calculation);

  const { t } = useTranslation();
  const { locale } = useLocale();
  const dispatch = useAppDispatch();
  const { getCalculateBody } = useCalculation();
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

    // show added but not connected blocks
    if (getNotConnectedBlocks(blocks, connections).length > 0) {
      getNotConnectedBlocks(blocks, connections).forEach((b) => {
        dispatch(
          setBlockStyles({
            id: b._id,
            data: {
              border: '3px solid red',
            },
          }),
        );
      });
      if (blocks.length > 1) {
        showSnackbar(t('snackbar:not-connected-blocks'), 'error');
      }
      return;
    }
    setTimeout(async () => {
      const res = getCalculateBody(blocks, connections, allMethods);
      if (res !== undefined && res.calculate) {
        await dispatch(setCalculationMatrixId(res.matrixIndexes));
        await dispatch(getResults({ locale, params: res.body }));
      }
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
      <DragSettings />
      <Divider orientation="vertical" flexItem />
      <Stack direction="row" gap={2}>
        <Button
          text={t('results:clear')}
          onClick={handleClearClick}
          startIcon={<HighlightOffIcon />}
          variant="contained"
        />
        <Button
          text={t('results:calculate')}
          onClick={handleCalculateClick}
          startIcon={<PlayCircleOutlineIcon />}
          variant="contained"
        />
      </Stack>
    </Paper>
  );
}

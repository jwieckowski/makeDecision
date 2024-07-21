import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Stack, Box, Typography } from '@mui/material';

// ICONS
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

// REDUX
import { RootState, useAppDispatch } from '@/state';

// SLICES
import {
  setSize,
  setHeadSize,
  setCurveness,
  setColor,
  setPath,
  setGrid,
  setGridSize,
} from '@/state/slices/settingsSlice';

// COMPONENTS
import Input from '@/components/Input';
import Select from '@/components/Select';
import Checkbox from '@/components/Checkbox';
import ColorPicker from '@/components/ColorPicker';

// CONST
import { PATHS } from '@/common/calculations';
import {
  MIN_SETTINGS_VALUE,
  MIN_CURVENESS_VALUE,
  MAX_SETTINGS_VALUE,
  MAX_CURVENESS_VALUE,
  STEP_SETTINGS_VALUE,
  STEP_CURVENESS_VALUE,
  MIN_GRID_VALUE,
  MAX_GRID_VALUE,
} from '@/common/ui';

export default function DragSettings() {
  const { size, headSize, curveness, path, color, gridOn, gridSize } = useSelector(
    (state: RootState) => state.settings,
  );

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  return (
    <Stack
      className="tour-step-four"
      direction="row"
      gap={2}
      sx={{ height: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
    >
      <Box
        sx={{
          minHeight: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80px',
        }}
      >
        <Typography variant="subtitle2" align="left" sx={{ verticalAlign: 'top' }}>
          {t('common:settings')}
        </Typography>
        <SettingsSuggestIcon />
      </Box>
      <Input
        type={'number'}
        value={headSize}
        label={`${t('results:head-size')}`}
        onChange={(e) => {
          dispatch(setHeadSize(+e.target.value));
        }}
        min={MIN_SETTINGS_VALUE}
        max={MAX_SETTINGS_VALUE}
        step={STEP_SETTINGS_VALUE}
      />
      <Input
        type={'number'}
        value={size}
        label={`${t('results:size')}`}
        onChange={(e) => {
          dispatch(setSize(+e.target.value));
        }}
        min={MIN_SETTINGS_VALUE}
        max={MAX_SETTINGS_VALUE}
        step={STEP_SETTINGS_VALUE}
      />
      <Select
        items={PATHS}
        value={path}
        onChange={(e) => {
          dispatch(setPath(e.target.value));
        }}
        label={`${t('results:path')}`}
        minWidth={100}
      />
      <Input
        type={'number'}
        value={curveness}
        label={`${t('results:curveness')}`}
        onChange={(e) => {
          dispatch(setCurveness(+e.target.value));
        }}
        min={MIN_CURVENESS_VALUE}
        max={MAX_CURVENESS_VALUE}
        step={STEP_CURVENESS_VALUE}
        disabled={path !== PATHS[0].value}
      />
      <ColorPicker
        value={color}
        onChange={(e) => {
          dispatch(setColor(e.target.value));
        }}
        label={`${t('results:color')}`}
      />
      <Checkbox
        id="settingsCheckbox"
        label={`${t('results:grid')}`}
        value={gridOn}
        onChange={(e) => {
          dispatch(setGrid(e.target.checked));
        }}
      />
      <Input
        label={`${t('results:size')}`}
        type={'number'}
        value={gridSize}
        onChange={(e) => {
          dispatch(setGridSize(e.target.value));
        }}
        disabled={!gridOn}
        min={MIN_GRID_VALUE}
        max={MAX_GRID_VALUE}
      />
    </Stack>
  );
}

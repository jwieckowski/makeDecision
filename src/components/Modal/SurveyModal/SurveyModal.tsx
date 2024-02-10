import { useState, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

// REDUX
import { useAppDispatch } from '@/state';

// API
import { postUsageSurveyItem } from '@/api/surveys';

// HOOKS
import { useSurveyStatus } from '@/hooks';

// COMPONENTS
import SurveyRadioList from '@/components/Survey/SurveyRadioList';
import Button from '@/components/Button';

// TYPES
import { SurveyUsage } from '@/types';

type SurveyModalType = {
  open: boolean;
  survey: SurveyUsage;
  handleSave: () => void;
};

export default function SurveyModal({ open, survey, handleSave }: SurveyModalType) {
  const { recordSurveyAnswer } = useSurveyStatus();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [value, setValue] = useState<string>('');

  const handleSaveClick = async () => {
    if (value === '') return;
    const selectedOption = survey.options
      .flatMap((item) => (item?.options ? item.options : item))
      .find((item) => item.id === +value);

    dispatch(postUsageSurveyItem({ option: value, name: selectedOption?.name ?? '' }))
      .then(() => {
        recordSurveyAnswer();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        handleSave();
      });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const isSurveyFilled = () => {
    if (value === '') return false;

    if (survey.options.find((item) => item.id === +value)?.options) return false;

    return true;
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {survey.title}
        <span style={{ color: 'red' }}>*</span>
      </DialogTitle>
      <DialogContent dividers>
        <SurveyRadioList options={survey.options} value={value} handleChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button text={t('common:save')} variant="contained" onClick={handleSaveClick} disabled={!isSurveyFilled()} />
      </DialogActions>
    </Dialog>
  );
}

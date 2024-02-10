import { ChangeEvent } from 'react';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, Typography } from '@mui/material';
import { UsageOption } from '@/types';
import SurveyRadioList from '../SurveyRadioList';

type SurveyRadioProps = {
  option: UsageOption;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SurveyRadio({ option, value, handleChange }: SurveyRadioProps) {
  if (!option?.options)
    return <FormControlLabel value={option.id} key={option.id} control={<Radio />} label={option.label} />;

  return (
    <>
      <FormControlLabel value={option.id} key={option.id} control={<Radio />} label={option.label} />
      {value.includes(`${option.id}`) ? (
        <Container sx={{ paddingLeft: '20px' }}>
          <Typography variant="body1" sx={{ pt: 1, fontWeight: 'bold' }}>
            {option.title}
            <span style={{ color: 'red' }}>*</span>:
          </Typography>
          <SurveyRadioList options={option.options} value={value} handleChange={handleChange} />
        </Container>
      ) : null}
    </>
  );
}

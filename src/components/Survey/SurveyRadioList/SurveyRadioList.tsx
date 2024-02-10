import { ChangeEvent } from 'react';
import RadioGroup from '@mui/material/RadioGroup';

// COMPONENTS
import SurveyRadio from '../SurveyRadio';

// TYPES
import { UsageOption } from '@/types';

type SurveyRadioListType = {
  options: UsageOption[];
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function SurveyRadioList({ options, value, handleChange }: SurveyRadioListType) {
  return (
    <RadioGroup aria-label="survey" name="survey" value={value} onChange={handleChange}>
      {options.map((option) => {
        return <SurveyRadio key={option.id} option={option} value={value} handleChange={handleChange} />;
      })}
    </RadioGroup>
  );
}

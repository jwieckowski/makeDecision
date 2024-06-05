import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Slider,
  FormHelperText,
} from '@mui/material';

// HOOKS
import useSnackbars from '@/hooks/useSnackbars';

// REDUX
import { useAppDispatch } from '@/state';

// API
import { postRatingSurveyItem } from '@/api/surveys';

// TYPES
import { SurveyRating } from '@/types';

export default function Rating() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbars();

  const initialFormData: SurveyRating = {
    helpful: '',
    easyInterface: '',
    overallRating: 0,
    changeSuggestion: '',
    easeOfUse: 0,
    features: '',
  };

  const [formData, setFormData] = useState<SurveyRating>(initialFormData);

  const [errors, setErrors] = useState<{ [key in keyof SurveyRating]?: string }>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSliderChange = (name: keyof SurveyRating) => (event: Event, value: number | number[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value as number,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      dispatch(postRatingSurveyItem(formData))
        .then(() => {
          setFormData(initialFormData);
          setErrors({});
          showSnackbar(t('common:survey-thanks'), 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const validate = () => {
    let newErrors: { [key in keyof SurveyRating]?: string } = {};

    if (!formData.helpful) newErrors.helpful = t('about:rate-required');
    if (!formData.easyInterface) newErrors.easyInterface = t('about:rate-required');
    // if (formData.overallRating === 0) newErrors.overallRating = t('about:rate-required');
    // if (formData.easeOfUse === 0) newErrors.easeOfUse = t('about:rate-required');
    // if (formData.performanceRating === 0) newErrors.performanceRating = t('about:rate-required');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:rate-us').toUpperCase()}
      </Typography>
      <Container maxWidth="md">
        <Typography variant="body1" mb={4} sx={{ textAlign: 'justify' }}>
          {t('about:rate-us-text-1')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl component="fieldset" error={!!errors.helpful}>
              <FormLabel component="legend">
                {t('about:rate-question-1')} <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <RadioGroup name="helpful" value={formData.helpful} onChange={handleChange} row>
                <FormControlLabel value="yes" control={<Radio />} label={t('common:yes')} />
                <FormControlLabel value="no" control={<Radio />} label={t('common:no')} />
              </RadioGroup>
              {errors.helpful && <FormHelperText>{errors.helpful}</FormHelperText>}
            </FormControl>

            <FormControl component="fieldset" error={!!errors.easyInterface}>
              <FormLabel component="legend">
                {t('about:rate-question-2')} <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <RadioGroup name="easyInterface" value={formData.easyInterface} onChange={handleChange} row>
                <FormControlLabel value="yes" control={<Radio />} label={t('common:yes')} />
                <FormControlLabel value="no" control={<Radio />} label={t('common:no')} />
              </RadioGroup>
              {errors.easyInterface && <FormHelperText>{errors.easyInterface}</FormHelperText>}
            </FormControl>

            <FormControl component="fieldset" error={!!errors.easeOfUse}>
              <FormLabel component="legend">
                {t('about:rate-question-5')} <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Slider
                value={formData.easeOfUse}
                onChange={handleSliderChange('easeOfUse')}
                aria-labelledby="ease-of-use-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={5}
              />
              {errors.easeOfUse && <FormHelperText>{errors.easeOfUse}</FormHelperText>}
            </FormControl>

            <FormControl component="fieldset" error={!!errors.overallRating}>
              <FormLabel component="legend">
                {t('about:rate-question-6')} <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Slider
                value={formData.overallRating}
                onChange={handleSliderChange('overallRating')}
                aria-labelledby="overall-rating-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={5}
              />
              {errors.overallRating && <FormHelperText>{errors.overallRating}</FormHelperText>}
            </FormControl>

            <TextField
              name="changeSuggestion"
              label={t('about:rate-question-4')}
              value={formData.changeSuggestion}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              inputProps={{ maxLength: 200 }}
            />

            <TextField
              name="features"
              label={t('about:rate-question-7')}
              value={formData.features}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />

            <Button type="submit" variant="contained" color="primary">
              {t('common:submit')}
            </Button>
          </Stack>
        </form>
      </Container>
    </Container>
  );
}

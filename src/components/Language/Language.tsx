import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';

// REDUX
import { useAppDispatch } from '@/state';

// SLICES
import { getMethodsDescriptions } from '@/api/descriptions';
import { fetchAllMethods } from '@/api/dictionary';

// COMPONENTS
import Select from '@/components/Select';

// CONST
import { LANGUAGES } from '@/common/languages';

export default function Language() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const dispatch = useAppDispatch();

  const handleChange = async (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
    setLang(event.target.value as string);
    window.localStorage.setItem('locale', event.target.value as string);

    if (window.location.pathname.includes(`/calculations`)) {
      window.location.reload();
    }

    // reload application
    await dispatch(getMethodsDescriptions(event.target.value as string));
    await dispatch(fetchAllMethods(event.target.value as string));
  };

  return (
    <Box>
      <Select items={LANGUAGES} value={lang} onChange={handleChange} light={true} small={true} />
    </Box>
  );
}

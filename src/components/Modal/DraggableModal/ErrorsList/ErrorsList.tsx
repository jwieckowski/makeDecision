import { List } from '@mui/material';
import ErrorItem from './ErrorItem';

import { useAppSelector } from '@/state';

export default function ErrorsList() {
  const { errorsList } = useAppSelector((state) => state.calculation);
  return (
    <List sx={{ maxHeight: 200, overflow: 'auto', width: 400, py: 2 }}>
      {errorsList.map((error, index) => (
        <ErrorItem key={index} message={error.message} id={error?.id ?? `${error.id}`} type={error?.type} />
      ))}
    </List>
  );
}

import { ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type ErrorItemProps = {
  id: null | string;
  type: null | string;
  message: string;
};

export default function ErrorsItem({ id, type, message }: ErrorItemProps) {
  return (
    <ListItem
      sx={{
        width: '95%',
        mx: 'auto',
        border: '2px solid #ff7676',
        bgcolor: '#fdd5d5',
        borderRadius: 4,
        padding: 0,
        pl: 1,
        mb: 1,
      }}
    >
      <ListItemIcon>
        <ErrorOutlineIcon color="error" />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography style={{ fontSize: 14, fontWeight: 'bold' }} variant="body1">
            {message}
          </Typography>
        }
        secondary={
          type && id ? (
            <Typography variant="body2" style={{ fontSize: 11 }}>
              {type.toUpperCase()} ID ({id})
            </Typography>
          ) : null
        }
      />
    </ListItem>
  );
}

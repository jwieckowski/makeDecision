import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

type HelperTextProps = {
  messages: string[];
};

export default function MyFormHelperText({ messages }: HelperTextProps) {
  return (
    <FormHelperText>
      {messages.map((message) => (
        <Typography variant="caption" component="div" key={message}>
          {message}
        </Typography>
      ))}
    </FormHelperText>
  );
}

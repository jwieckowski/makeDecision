import { useMemo } from 'react';
import Container from '@mui/material/Container';

// REDUX
import { useAppSelector } from '@/state';

// COMPONENTS
import { Files, MCDA, Instruction, Technology, Updates, Rating } from './AboutContent';

export default function About() {
  const { menuItemIndex } = useAppSelector((state) => state.menu);

  const content = useMemo(
    () => [
      <MCDA key={`about-1`} />,
      <Instruction key={`about-2`} />,
      <Files key={`about-3`} />,
      <Technology key={`about-4`} />,
      <Updates key={`about-5`} />,
      <Rating key={`about-6`} />,
    ],
    [],
  );

  return <Container>{content[menuItemIndex]}</Container>;
}

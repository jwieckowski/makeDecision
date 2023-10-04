import React from 'react';

// REDUX
import { BlockType } from '@/types';

// COMPONENTS
import Connection from './Connection';
import Matrix from './Matrix';
import Method from './Method';
import Weight from './Weight';
import Usage from './Usage';

type ModalContentProps = {
  content: string;
  data: null | BlockType;
};

type Dictionary = {
  [key: string]: React.ReactElement;
};

export default function ModalContent({ content, data }: ModalContentProps) {
  const contentType: Dictionary = {
    matrix: <Matrix data={data} />,
    method: <Method data={data} />,
    weights: <Weight data={data} />,
    connection: <Connection />,
    usage: <Usage />,
  };

  return contentType[content] ? contentType[content] : null;
}

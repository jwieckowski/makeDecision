import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Container from '@mui/material/Container';

import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you

type MarkdownProps = {
  text: string;
};

export default function MarkdownText({ text }: MarkdownProps) {
  return (
    <Container
      style={{
        maxWidth: '800px',
        margin: '0 5px',
        overflow: 'hidden',
        textAlign: 'justify',
      }}
    >
      <ReactMarkdown children={text} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} />
    </Container>
  );
}

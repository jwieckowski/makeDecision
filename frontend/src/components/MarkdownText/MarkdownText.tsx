import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import {Box} from '@mui/material'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

type MarkdownProps = {
  text: string
}

export default function MarkdownText({text}: MarkdownProps) {
    return (
      <Box sx={{my: 2}}>
        <ReactMarkdown
          children={text}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      </Box>
    )
}
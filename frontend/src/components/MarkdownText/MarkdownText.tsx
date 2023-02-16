import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

// const _mapProps = (props: any) => ({
//   ...props,
//   escapeHtml: false,
//   plugins: [
//     RemarkMathPlugin
//   ],
//   renderers: {
//     ...props.renderers,
//     math: ({ value }: any) => `math: ${value}`,
//     inlineMath: ({ value }: any) => `inlineMath: ${value}`
//   }
// });


type MarkdownProps = {
  text: string
}

export default function MarkdownText({text}: MarkdownProps) {
    // return (
    //     <ReactMarkdown {..._mapProps(props)} />
    // )
    return (
      <ReactMarkdown
        children={text}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
    )
}
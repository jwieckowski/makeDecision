import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Container from "react-bootstrap/Container";

import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you

// STYLES
import styles from "./MarkdownText.styles";

type MarkdownProps = {
  text: string;
};

export default function MarkdownText({ text }: MarkdownProps) {
  return (
    <Container
      style={{
        ...styles.wrapper,
        textAlign: "justify",
      }}
    >
      <ReactMarkdown
        children={text}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
    </Container>
  );
}

import React, { useState, useEffect } from "react";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  maxHeight?: number | string;
  maxWidth?: number | string;
};

const Image = ({
  src,
  alt,
  width,
  height,
  maxHeight,
  maxWidth,
}: ImageProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const onLoaded = () => {
    setTimeout(() => {
      setLoading(false);
    }, 250);
  };
  return (
    <div>
      {src !== null ? (
        <img
          src={src}
          alt={alt}
          width={width ? width : undefined}
          height={height ? height : undefined}
          style={{
            visibility: loading ? "hidden" : "visible",
            opacity: loading ? "0" : "1",
            transition: "opacity 300ms ease-in",
            maxHeight: maxHeight ? maxHeight : "auto",
            maxWidth: maxWidth ? maxWidth : "auto",
            minWidth: "400px",
          }}
          onLoad={onLoaded}
        />
      ) : null}
    </div>
  );
};

export default Image;

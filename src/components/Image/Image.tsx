import React, { useState, useEffect } from "react";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const Image = ({ src, alt, width, height }: ImageProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  const onLoaded = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
            objectFit: "contain",
            visibility: loading ? "hidden" : "visible",
            opacity: loading ? "0" : "1",
            transition: "opacity 300ms ease-in",
          }}
          onLoad={onLoaded}
        />
      ) : null}
    </div>
  );
};

export default Image;

import React from "react";

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const Image = ({ src, alt, width, height }: ImageProps) => {
  return (
    <div>
      {src !== null && (
        <img
          src={src}
          alt={alt}
          width={width ? width : undefined}
          height={height ? height : undefined}
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default Image;

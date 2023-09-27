type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  maxHeight?: number | string;
  maxWidth?: number | string;
};

const Image = ({ src, alt, width, height, maxHeight, maxWidth }: ImageProps) => {
  return (
    <div>
      {src !== null ? (
        <img
          src={src}
          alt={alt}
          width={width ? width : undefined}
          height={height ? height : undefined}
          style={{
            maxHeight: maxHeight ? maxHeight : 'auto',
            maxWidth: maxWidth ? maxWidth : 'auto',
            minWidth: '400px',
          }}
          loading="lazy"
        />
      ) : null}
    </div>
  );
};

export default Image;

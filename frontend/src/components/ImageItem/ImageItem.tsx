import React from 'react';

type ImageProps = {
  src: any,
  alt: string,
}

const ImageItem = ({src, alt}: ImageProps) => {
    return (
      <>
        {src !== null && <img src={src} alt={alt}/>}
      </>
    )
}

export default ImageItem
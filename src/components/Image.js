import React from 'react';

const Image = ({ src, alt, width, height, className }) => {
  const style = {
    width: width ? `${width}px` : 'auto',
    height: height ? `${height}px` : 'auto',
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      style={style}
      className={className}
    />
  );
};

export default Image;

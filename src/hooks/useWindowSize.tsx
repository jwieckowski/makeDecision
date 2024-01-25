import { useState, useEffect } from 'react';

type WindowSizeProps = {
  width: null | number;
  height: null | number;
};

function UseWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: null,
    height: null,
  });

  const getWindowSize = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  useEffect(() => {
    setWindowSize(getWindowSize()); // Necessary to make sure dimensions are set upon initial load

    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default UseWindowSize;

// CONST
import { DRAGGABLE_WIDTH, DRAGGABLE_HEIGHT } from '@/common/ui';

type dict = {
  [key: string]: object;
};

export default function blockStyles(type: string, active: boolean, error: boolean) {
  const method = {
    backgroundColor: 'rgba(186,225,255, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(0, 125, 220)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const matrix = {
    backgroundColor: 'rgba(254,255,163, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(207, 209, 0)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const weights = {
    backgroundColor: 'rgba(255,223,186, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(220, 118, 0)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const ranking = {
    backgroundColor: 'rgba(205, 232, 230, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(69, 150, 144)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const visualization = {
    backgroundColor: 'rgba(215,205,254, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(50, 5, 225)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const correlation = {
    backgroundColor: 'rgb(192,244,184 , 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(50, 185, 29)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const neutral = {
    backgroundColor: 'rgba(102, 102, 102, 0.9)',
    border: active ? '3px solid black' : error ? '3px solid rgb(236, 56, 91)' : '3px solid rgb(102, 102, 102)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const types: dict = {
    method: method,
    matrix: matrix,
    weights: weights,
    ranking: ranking,
    visualization: visualization,
    correlation: correlation,
  };

  return types[type] || neutral;
}

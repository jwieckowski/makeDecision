// CONST
import { DRAGGABLE_WIDTH, DRAGGABLE_HEIGHT } from '@/common/const';

type dict = {
  [key: string]: object;
};

export default function blockStyles(type: string, active: boolean) {
  const method = {
    backgroundColor: 'rgba(186,225,255, 0.9)',
    border: active ? '3px solid black' : '3px solid rgb(186,225,255)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const matrix = {
    backgroundColor: 'rgba(254,255,163, 0.9)',
    border: active ? '3px solid black' : '3px solid rgba(254,255,163)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const weights = {
    backgroundColor: 'rgba(255,223,186, 0.9)',
    border: active ? '3px solid black' : '3px solid rgba(255,223,186)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const ranking = {
    backgroundColor: 'rgba(236, 56, 91, 0.9)',
    border: active ? '3px solid black' : '3px solid rgb(236, 56, 91)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const visualization = {
    backgroundColor: 'rgba(215,205,254, 0.9)',
    border: active ? '3px solid black' : '3px solid rgb(215,205,254)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const correlation = {
    backgroundColor: 'rgb(192,244,184 , 0.9)',
    border: active ? '3px solid black' : '3px solid rgb(192,244,184)',
    minHeight: `${DRAGGABLE_HEIGHT}px`,
    width: `${DRAGGABLE_WIDTH}px`,
  };

  const neutral = {
    backgroundColor: 'rgba(102, 102, 102, 0.7)',
    border: active ? '3px solid black' : '3px solid rgb(102, 102, 102)',
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

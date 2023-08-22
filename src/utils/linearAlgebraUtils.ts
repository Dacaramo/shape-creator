export type Direction = 'right' | 'bottom' | 'top' | 'left';

export const getDirection = (dx: number, dy: number): undefined | Direction => {
  if (dx === 0 && dy === 0) {
    return;
  }

  /* eslint-disable */
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle >= -45 && angle < 45) {
    return 'right';
  } else if (angle >= 45 && angle < 135) {
    return 'bottom';
  } else if (angle >= -135 && angle < -45) {
    return 'top';
  } else {
    return 'left';
  }
};

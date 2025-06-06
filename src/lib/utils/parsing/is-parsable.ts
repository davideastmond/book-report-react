export const isParsable = (lg: string): boolean => {
  if (!lg || isNaN(parseInt(lg, 10))) {
    return false;
  }
  return true;
};

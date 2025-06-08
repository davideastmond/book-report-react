export const isParsable = (lg: string): boolean => {
  const parsedVal = parseInt(lg, 10);
  if (!lg || isNaN(parsedVal)) {
    return false;
  }

  if (!isNaN(parsedVal) && containsLetters(lg)) {
    return false;
  }

  if (containsMultipleDecimals(lg)) {
    return false;
  }
  if (lg.length > 2) {
    if (containsLetters(lg)) {
      return false;
    }
  }
  return true;
};

function containsLetters(str: string) {
  return /[A-Za-z]/.test(str);
}

function containsMultipleDecimals(str: string) {
  return /\..*\./.test(str);
}

const randomStringFromArray = (
  array: string[],
  returnLength: number,
): string => {
  if (array.length === 0 || returnLength < 0) return '';

  const returnString: string[] = [];

  for (let i = 0; i < returnLength; i++) {
    const randomIndex = Math.floor(Math.random() * array.length);
    returnString.push(array[randomIndex]);
  }

  return returnString.join(' ');
};

export { randomStringFromArray };

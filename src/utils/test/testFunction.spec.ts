import { randomStringFromArray } from '../testFunctions';

describe('testFunction utility tests', () => {
  describe('randomStringFromArray', () => {
    it('should return a string of the specified word length', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e'];
      const testLength = 10;
      const testString = randomStringFromArray(testArray, testLength);
      const testStringWordCount = testString.split(' ').length;

      expect(testStringWordCount).toEqual(testLength);
    });

    it('returns an empty string if the array is empty', () => {
      const testArray: string[] = [];
      const testLength = 10;
      const testString = randomStringFromArray(testArray, testLength);

      expect(testString).toEqual('');
    });

    it('returns an empty string if returnLength is less than 0', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e'];
      const testLength = -1;
      const testString = randomStringFromArray(testArray, testLength);

      expect(testString).toEqual('');
    });
  });
});

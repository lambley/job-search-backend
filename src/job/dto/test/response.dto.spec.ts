import { ResponseDTO } from '../response.dto';
import {
  jobResultArrayFactory,
  jobDbResultsFactory,
} from '../../test/factories/jobFactory';

describe('ResponseDTO', () => {
  it('should be defined', () => {
    expect(new ResponseDTO([], 0)).toBeDefined();
  });

  it('should have a data property', () => {
    const response = new ResponseDTO([], 0);
    expect(response.data).toBeDefined();
  });

  it('should have a count property', () => {
    const response = new ResponseDTO([], 0);
    expect(response.count).toBeDefined();
  });

  describe('API data', () => {
    it('should return an array of jobs given JobResponse type', () => {
      const results = jobResultArrayFactory(10);

      const response = new ResponseDTO(results, 10);

      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toEqual(10);
    });
  });

  describe('DB data', () => {
    it('should return an array of jobs given JobDbResponse type', () => {
      const results = jobDbResultsFactory(10);

      const response = new ResponseDTO(results, 10);

      expect(response.data).toBeInstanceOf(Array);
      expect(response.data.length).toEqual(10);
    });
  });
});

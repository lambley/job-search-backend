export class ResponseDTO<T> {
  data: T[];
  count: number;
  // might add fields for pagination later on e.g.:
  // page: number;
  // results_per_page: number;
  // total_pages: number;
  // total_count: number;
  // previous_page: string || null; -> e.g. a link to the previous page of results
  // next_page: string || null; -> e.g. a link to the next page of results

  constructor(data: T[], count: number) {
    this.count = count;
    this.data = data;
  }
}

const mockPrismaKeywordJobRepository = {
  create: jest.fn(),
  findAllKeywordJobs: jest.fn(),
  findAllKeywordJobsByStatus: jest.fn(),
  updateStatusById: jest.fn(),
};

export { mockPrismaKeywordJobRepository };

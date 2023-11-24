const mockPrismaJobRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByAdzunaId: jest.fn(),
  findByTitleAndLocation: jest.fn(),
  findAll: jest.fn(),
  updateById: jest.fn(),
  deleteById: jest.fn(),
};

export { mockPrismaJobRepository };

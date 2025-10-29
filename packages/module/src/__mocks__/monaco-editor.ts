const mockEditor = {
  layout: jest.fn(),
  focus: jest.fn(),
  dispose: jest.fn(),
  getModel: jest.fn(),
  updateOptions: jest.fn()
};

const mockModel = {
  updateOptions: jest.fn(),
  dispose: jest.fn()
};

module.exports = {
  editor: {
    create: jest.fn(() => mockEditor),
    getModels: jest.fn(() => [mockModel])
  }
};

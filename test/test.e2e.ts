import * as path from 'path';
import * as fg from 'fast-glob';
import * as nock from 'nock';

const specs = fg.sync(
  path.join(__dirname, '/modules/**/*.spec.ts').replace(/\\/g, '/'),
);

specs.forEach((file) => {
  require(file);
});

afterAll(() => {
  nock.restore();
});

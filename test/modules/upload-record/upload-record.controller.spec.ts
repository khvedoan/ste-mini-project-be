import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as fs from 'mz/fs';
import { DataRecordHelper } from '../../helpers/data-record.helper';
import * as qs from 'qs';
import { UploadedRecordListResDto } from '../../../src/modules/upload-record/dto';

describe('API Test Suite', () => {
  let app: INestApplication;
  let server: any;
  let dataRecordHelper: DataRecordHelper;

  beforeAll(() => {
    app = global.testContext.app as INestApplication;
    server = app.getHttpServer();
    dataRecordHelper = new DataRecordHelper(global.testContext.module);
  });

  afterEach(async () => {
    await dataRecordHelper.clear();
    jest.restoreAllMocks();
  });

  describe('POST /csv-file', () => {
    it('Should fail with bad request response due to no file provided', async () => {
      await request(server)
        .post(`/csv-file`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should fail with bad request response due to bad formatted csv file', async () => {
      await request(server)
        .post(`/csv-file`)
        .attach(
          'file',
          fs.readFileSync(`${__dirname}/bad-file.csv`),
          'test.csv',
        )
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should process csv file successfully', async () => {
      await request(server)
        .post(`/csv-file`)
        .attach('file', fs.readFileSync(`${__dirname}/test.csv`), 'test.csv')
        .expect(HttpStatus.OK);

      const uploadedRecords = await dataRecordHelper.getDataRecords();
      expect(uploadedRecords.length).toEqual(2);
      expect(
        uploadedRecords.find((record) => record.email === 'Eliseo@gardner.biz'),
      ).toBeTruthy();
    });
  });

  describe('GET /uploaded-records', () => {
    it('Should fail with bad request response due to no limit provided', async () => {
      await dataRecordHelper.createDataRecords(10);
      const query = qs.stringify({
        page: 1,
      });

      await request(server)
        .get(`/uploaded-records?${query}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should fail with bad request response due to no page provided', async () => {
      await dataRecordHelper.createDataRecords(10);
      const query = qs.stringify({
        limit: 10,
      });

      await request(server)
        .get(`/uploaded-records?${query}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should get list of uploaded records successfully', async () => {
      await dataRecordHelper.createDataRecords(10);
      const query = qs.stringify({
        page: 1,
        limit: 10,
      });

      const { body }: { body: UploadedRecordListResDto } = await request(server)
        .get(`/uploaded-records?${query}`)
        .expect(HttpStatus.OK);

      expect(body.data.length).toEqual(10);
      const { page, pageCount, pageSize } = body;
      expect([page, pageCount, pageSize]).toEqual([1, 1, 10]);
    });

    it('Should get list of uploaded records successfully with search string', async () => {
      await dataRecordHelper.createDataRecords(9);
      const foundRecordWithName = await dataRecordHelper.createDataRecord({
        name: 'test search_string name',
      });
      const foundRecordWithEmail = await dataRecordHelper.createDataRecord({
        email: 'search_string@mail.com',
      });
      const query = qs.stringify({
        page: 1,
        limit: 10,
        search: 'search_string',
      });

      const { body }: { body: UploadedRecordListResDto } = await request(server)
        .get(`/uploaded-records?${query}`)
        .expect(HttpStatus.OK);

      expect(body.data.length).toEqual(2);
      expect(
        body.data.filter((record) => record.name === foundRecordWithName.name)
          .length,
      ).toEqual(1);
      expect(
        body.data.filter(
          (record) => record.email === foundRecordWithEmail.email,
        ).length,
      ).toEqual(1);
      const { page, pageCount, pageSize } = body;
      expect([page, pageCount, pageSize]).toEqual([1, 1, 10]);
    });
  });
});

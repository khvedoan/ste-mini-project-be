export class UploadedRecord {
  recordId: number;
  postId: number;
  id: string;
  name: string;
  email: string;
  body: string;
}

export class UploadedRecordListResDto {
  page: number;
  pageCount: number;
  pageSize: number;
  data: UploadedRecord[];
}

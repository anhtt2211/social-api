import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: "YOUR_ACCESS_KEY",
      secretAccessKey: "YOUR_SECRET_KEY",
    });
    this.s3 = new AWS.S3({
      region: "YOUR_REGION",
    });
  }

  async uploadFile(
    file: Express.Multer.File
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: "YOUR_BUCKET_NAME",
      Body: file.buffer,
      Key: `${new Date().getTime()}-${file.originalname}`,
    };

    return this.s3.upload(params).promise();
  }

  async downloadFile(key: string): Promise<AWS.S3.GetObjectOutput> {
    const params = {
      Bucket: "YOUR_BUCKET_NAME",
      Key: key,
    };

    return this.s3.getObject(params).promise();
  }

  async deleteFile(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: "YOUR_BUCKET_NAME",
      Key: key,
    };

    return this.s3.deleteObject(params).promise();
  }
}

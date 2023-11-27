import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { FileEntity, FileWritePort, MediaRepositoryToken } from "../core";

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string = process.env.AWS_BUCKET_NAME;
  constructor(
    @Inject(MediaRepositoryToken.Write)
    private readonly fileWriteRepository: FileWritePort
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(
    userId: number,
    file: Express.Multer.File
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    try {
      const params: AWS.S3.Types.PutObjectRequest = {
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: `articles/${new Date().getTime()}-${file.originalname}`,
        ACL: "public-read",
      };

      const fileUpload = await this.s3.upload(params).promise();

      const fileEntity: FileEntity = new FileEntity({
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: fileUpload.Location,
        key: fileUpload.Key,
        author: {
          id: userId,
        },
      });
      await this.fileWriteRepository.save(fileEntity);

      return fileUpload;
    } catch (error) {
      throw new HttpException("Cannot upload file", HttpStatus.BAD_REQUEST);
    }
  }

  // Method to get a signed URL for private access
  getSignedUrl(key: string): string {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60 * 5, // The URL will expire in 5 minutes
    });
  }

  async downloadFile(key: string): Promise<AWS.S3.GetObjectOutput> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    return this.s3.getObject(params).promise();
  }

  async deleteFile(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    return this.s3.deleteObject(params).promise();
  }
}

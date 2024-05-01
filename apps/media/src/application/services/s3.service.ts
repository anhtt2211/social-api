import { Inject, Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

import { FileEntity, FilePort, MEDIA_REPOSITORY } from "../../core";

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string = process.env.AWS_BUCKET_NAME;
  private readonly awsRegion: string = process.env.AWS_REGION;

  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly fileRepository: FilePort
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: this.awsRegion,
    });
    this.s3 = new AWS.S3();
  }

  async generatePresignedUrl(userId: number): Promise<any> {
    const key = `user-uploads/${userId}/${new Date().getTime()}.jpg`;
    const url = `https://${this.bucketName}.s3.${this.awsRegion}.amazonaws.com/${key}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60 * 3, // Expires in 3 minutes
      ContentType: "image/jpg",
      ACL: "public-read",
    };

    const signedUrl = await this.s3.getSignedUrlPromise("putObject", params);

    // store the file metadata
    const file = new FileEntity({
      url,
      author: {
        id: userId,
      },
    });
    await this.fileRepository.save(file);

    return {
      signedUrl,
      url,
    };
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

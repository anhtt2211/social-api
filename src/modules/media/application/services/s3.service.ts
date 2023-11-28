import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import * as AWS from "aws-sdk";

import { FILE_RMQ_CLIENT } from "@configs";
import {
  FileEntity,
  FileWritePort,
  IPayloadFileCreated,
  MediaRepositoryToken,
} from "../../core";
import { MessageCmd } from "../../core/enums";

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string = process.env.AWS_BUCKET_NAME;
  private readonly awsRegion: string = process.env.AWS_REGION;

  constructor(
    @Inject(MediaRepositoryToken.Write)
    private readonly fileWriteRepository: FileWritePort,

    @Inject(FILE_RMQ_CLIENT)
    private readonly fileRmqClient: ClientProxy
  ) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: this.awsRegion,
    });
    this.s3 = new AWS.S3();
  }

  // async uploadFile(userId: number, file: Express.Multer.File): Promise<string> {
  //   try {
  //     const params: AWS.S3.Types.PutObjectRequest = {
  //       Bucket: this.bucketName,
  //       Body: file.buffer,
  //       Key: `articles/${new Date().getTime()}-${file.originalname}`,
  //       ACL: "public-read",
  //     };

  //     const fileUpload = await this.s3.upload(params).promise();

  //     const fileEntity: FileEntity = new FileEntity({
  //       name: file.originalname,
  //       size: file.size,
  //       mimeType: file.mimetype,
  //       url: fileUpload.Location,
  //       key: fileUpload.Key,
  //       author: {
  //         id: userId,
  //       },
  //     });
  //     await this.fileWriteRepository.save(fileEntity);

  //     this.articleRmqClient.emit<any, IPayloadFileCreated>(
  //       { cmd: MessageCmd.FILE_CREATED },
  //       { file: fileEntity }
  //     );

  //     return this.getSignedUrl(fileUpload.Key);
  //   } catch (error) {
  //     throw new HttpException("Cannot upload file", HttpStatus.BAD_REQUEST);
  //   }
  // }

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
    await this.fileWriteRepository.save(file);
    this.fileRmqClient.emit<any, IPayloadFileCreated>(
      { cmd: MessageCmd.FILE_CREATED },
      { file }
    );

    return {
      signedUrl,
      url,
    };
  }

  // Method to get a signed URL for private access
  // private getSignedUrl(key: string, method: string = "getObject"): string {
  //   return this.s3.getSignedUrl(method, {
  //     Bucket: this.bucketName,
  //     Key: key,
  //     Expires: 60 * 5, // The URL will expire in 5 minutes
  //   });
  // }

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

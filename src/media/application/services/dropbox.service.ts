import { Injectable } from "@nestjs/common";
import { Dropbox } from "dropbox";
import { MediaOutput } from "../../core/media.interface";

@Injectable()
export class DropboxService {
  private dropbox: Dropbox;
  constructor() {
    this.dropbox = new Dropbox({
      accessToken: process.env.DROPBOX_TOKEN,
      clientId: process.env.DROPBOX_KEY,
      clientSecret: process.env.DROPBOX_SECRET,
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<MediaOutput> {
    try {
      await this.dropbox.filesUpload({
        path: `/${file.originalname}`,
        contents: file.buffer,
      });

      const {
        result: { url },
      } = await this.dropbox.sharingCreateSharedLinkWithSettings({
        path: `/${file.originalname}`,
      });

      const fileUrl = url.replace("www", "dl");

      return {
        media: { url: fileUrl },
      };
    } catch (error) {
      return error;
    }
  }
}

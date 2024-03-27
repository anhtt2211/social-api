export class IArticleBlockOutbox {
  id?: string;
  aggregatetype: string;
  aggregateid: string;
  type: string;
  payload: any;
}

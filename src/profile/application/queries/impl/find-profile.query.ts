export class FindProfileQuery {
  constructor(
    public readonly userId: number,
    public readonly followingUsername: string
  ) {}
}

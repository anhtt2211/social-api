export class UnFollowProfileCommand {
  constructor(
    public readonly followerId: number,
    public readonly username: string
  ) {}
}

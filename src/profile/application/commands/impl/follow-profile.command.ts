export class FollowProfileCommand {
  constructor(
    public readonly followerEmail: string,
    public readonly username: string
  ) {}
}

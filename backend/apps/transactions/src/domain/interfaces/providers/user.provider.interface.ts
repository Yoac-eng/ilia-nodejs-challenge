export interface IUserProvider {
  verifyUserExists(userId: string): Promise<boolean>;
}

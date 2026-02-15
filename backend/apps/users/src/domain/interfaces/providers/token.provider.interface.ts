export interface ITokenProvider {
  sign(payload: Record<string, unknown>): string;
}

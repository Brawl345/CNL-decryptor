export interface Options {
  enabled: boolean;
  openMode: 'popup' | 'tab';
}

export enum MessageVariant {
  Success = 'success',
  Error = 'error',
}

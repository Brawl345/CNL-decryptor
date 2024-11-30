import type { Options } from './types';

export const defaults: Options = Object.freeze({
  enabled: true,
  openMode: 'tab',
});

export const getOptions: () => Promise<Options> = async () => chrome.storage.local.get(defaults) as Promise<Options>;

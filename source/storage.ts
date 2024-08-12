interface Options {
  enabled: boolean;
}

const defaultOptions: Options = Object.freeze({
  enabled: true,
});

export const getOptions: () => Promise<Options> = async () =>
  chrome.storage.local.get(defaultOptions) as Promise<Options>;

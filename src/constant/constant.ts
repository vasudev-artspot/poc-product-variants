export const CONTENT_SERVICE_URLS = process.env.REACT_APP_CONTENT_SERVICE_URL!;
function required(key: string): string {
  const v = process.env[key];
  if (!v) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
}

export const CONSTANTS = {
  TOKEN: "token",
};

export const IMAGE_PREFIX_URL: string =
  required('REACT_APP_IMAGE_PREFIX_URL');
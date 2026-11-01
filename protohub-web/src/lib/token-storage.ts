const ACCESS_KEY = 'protohub.accessToken';
const REFRESH_KEY = 'protohub.refreshToken';

/** Guards every call — these run fine during SSR/build where `window` doesn't exist. */
const isBrowser = () => typeof window !== 'undefined';

export const tokenStorage = {
  getAccessToken: (): string | null => (isBrowser() ? localStorage.getItem(ACCESS_KEY) : null),
  getRefreshToken: (): string | null => (isBrowser() ? localStorage.getItem(REFRESH_KEY) : null),
  setTokens: (accessToken: string, refreshToken: string) => {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

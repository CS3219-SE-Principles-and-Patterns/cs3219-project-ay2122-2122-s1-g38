const refTokenKey = 'ref';

type TokenListenerType = (token?: string | null) => any;
const listeners: TokenListenerType[] = [];

const store = (token: string) => {
  localStorage.setItem(refTokenKey, token);
  listeners.forEach((cb) => cb(token));
};

const remove = () => {
  localStorage.removeItem(refTokenKey);
  listeners.forEach((cb) => cb(null));
};

const get = () => {
  return localStorage.getItem(refTokenKey);
};

const addListener = (cb: TokenListenerType) => {
  listeners.push(cb);
  return () => {
    const index = listeners.indexOf(cb);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const RefreshTokenService = {
  store,
  remove,
  get,
  addListener,
};

export default RefreshTokenService;

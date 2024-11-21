/* 本地存储文件 */

/** ***************** localStorage ********************* */
/**
 * 设置localStorage
 */
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 获取localStorage
 */
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * 移除localStorage
 */
export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}

/** ***************** sessionStorage ********************* */
/**
 * 设置sessionStorage
 */
export function setSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * 获取sessionStorage
 */
export function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

/**
 * 移除sessionStorage
 */
export function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}

/** ***************** cookie ************************** */
/**
 * 获取cookie
 * @param {string} name
 */
export function getCookie(name) {
  const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
  if (arr != null) {
    return unescape(arr[2]);
  }
  return null;
}

/**
 * 设置cookie
 * @param {string} name
 * @param {string} value
 * @param {number} seconds survival time
 */
export function setCookie(name, value, seconds) {
  const secondsParam = seconds || 0; // seconds有值就直接赋值，没有为0
  let expires = "";
  if (secondsParam !== 0) {
    // 设置cookie生存时间
    const date = new Date();
    date.setTime(date.getTime() + secondsParam * 1000);
    expires = `; expires=${date.toGMTString()}`;
  }
  document.cookie = `${name}=${escape(value)}${expires}; path=/`; // 转码并赋值
}

/**
 * 获取cookie
 * @param {string} name
 */
export function removeCookie(name) {
  let expires = "";
  const date = new Date();
  date.setTime(date.getTime() - 1);
  expires = `; expires=${date.toGMTString()}`;
  document.cookie = `${name}=''${expires}; path=/`; // 转码并赋值
}

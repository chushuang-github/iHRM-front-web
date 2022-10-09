/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} mobile
 * @returns {Boolean}
 */
export function validMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

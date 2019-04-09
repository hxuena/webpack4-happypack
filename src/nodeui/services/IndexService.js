/**
 * @auto xuena
 */
/**
 * IndexModle 用于生成一段异步数据
 */
export default class IndexService {
  /**
   * @constructor
   * @param {string} app koa2 上下文
   */
  constructor(app) {}
  /**
   * 获取具体数据的API接口  （即java交互的接口）
   * @returns {Promise} 返回异步数据
   * @example
   * return new Promise
   * getData()
   */
  getData() {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        resolve('IndexAction异步数据')
      }, 1000);
    })
  }
}
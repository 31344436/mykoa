
import axios,  {  type AxiosRequestConfig, type CancelTokenSource } from 'axios';

const requestMap: Map<string, CancelTokenSource> = new Map<string, CancelTokenSource>() ;//请求&AbortController的map

export default class AxiosCancelToken {
  /**
   * 添加请求
   * @param request 请求配置
   */
  public addRequest(request: AxiosRequestConfig) {
    const source = axios.CancelToken.source();
    request.cancelToken = source.token;
    const url = `${request.method}:${request.url}`;
    requestMap.set(url, source);
  }

  /**
   * 清除所有等待中的请求
   */
  public removeAllRequest(): void {
    requestMap.forEach((source) => {
      if (source) {
        source.cancel();
      }
    })
    requestMap.clear();
  }

  /**
   * 移除请求
   * @param request 请求配置
   */
  public removeRequest(request: AxiosRequestConfig): void {
    const url = `${request.method}:${request.url}`;
    if (requestMap.has(url)) {
      // 如果当前请求在等待中，取消它并将其从等待中移除
      const source = requestMap.get(url);
      if (source) {
        source.cancel();
      }
      requestMap.delete(url);
    }
  }
}

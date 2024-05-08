import axios , {type AxiosInstance , type InternalAxiosRequestConfig ,type AxiosResponse} from 'axios'
import AxiosCancelToken from './axios-cancel-token'

const axiosCancelToken = new AxiosCancelToken();
axios.defaults.timeout = 30000;
export default class HttpClient {
  /**
   * 创建axios
   * @param abortRequest 取消请求配置，可选值：same(取消相同请求)、all(取消所有请求)、none(不取消请求)
   * @returns
   */

  private static axiosInstance: AxiosInstance | null = null;

  public static getAxiosInstance( abortRequest: 'same' | 'all' | 'none' = 'none'): AxiosInstance {
    if (!HttpClient.axiosInstance) {
      const baseURL = "";
      HttpClient.axiosInstance = HttpClient.create(baseURL, abortRequest);
    }
    return HttpClient.axiosInstance;
  }

  private static create(baseURL: string, abortRequest: 'same' | 'all' | 'none' = 'none') {

    const instance : AxiosInstance = axios.create({ 
        withCredentials: true,
        baseURL: baseURL
      });
 
    instance.interceptors.request.use( 
       ( request:InternalAxiosRequestConfig ) => {
 
        switch (abortRequest) {
          case 'all':
            axiosCancelToken.removeAllRequest();
            break
          case 'same':
            axiosCancelToken.removeRequest(request);
            break
          default:
            break
        }
        axiosCancelToken.addRequest(request);
        return request;
      },
      (error:any) => {
        return Promise.reject(error);// 这里回引起catch，post时的catch里处理。
      }
    );

    instance.interceptors.response.use(
      (response : AxiosResponse) => {
        if (response && response.request) 
          axiosCancelToken.removeRequest(response.request);
 
        return response;
        
      },
      (error) => {
       
        return Promise.reject(error);
      }
    );

    return instance ;
  }
}

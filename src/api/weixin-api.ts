import HttpClient from '../http/http-client';
import { AxiosResponse } from 'axios';
 
export default class WeixinApi {
  
  //appid	string	是	小程序 appId
  //secret	string	是	小程序 appSecret
  //js_code	string	是	登录时获取的 code，可通过wx.login获取
  //grant_type	string	是	授权类型，此处只需填写 authorization_code
  static async jscode2session(appid: string,secret: string , js_code:string , 
                              grant_type:string ): Promise<AxiosResponse<any>>  {
    
    const p = {
      params:{
        appid,
        secret,
        js_code,
        grant_type
      }
    };
     
    return  await HttpClient.getAxiosInstance().get('https://api.weixin.qq.com/sns/jscode2session', p);
  }
  
  static async getuserphonenumber(session_key:string,code:string,openid?:String)
                                                    : Promise<AxiosResponse<any>> {

    const p = {
     code
    };

    return  await HttpClient.getAxiosInstance().post(
      'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + session_key , p);
  }


  static async getWXToken(grant_type:string,appid:string,secret:String)
                                                    : Promise<AxiosResponse<any>> {

    const p = {
      params:{
        grant_type,
        appid,
        secret
      }
    };

    return  await HttpClient.getAxiosInstance().get(
      'https://api.weixin.qq.com/cgi-bin/token', p);
  }
 

 
}

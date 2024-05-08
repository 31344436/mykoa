import { appConfig } from '../config';
import mysql from 'mysql2/promise';
import mysqlPool from "../models/mysql-model";
 
import WeixinApi from "../api/weixin-api";
import RedisClient from '../models/redis-client';
 



export default async function WXToken() :  Promise<string> {

  let key : string = "WXToken-Mykoa";
  
  const access_token = await RedisClient.getInstance().get(key);
  
  if (access_token) 
    return access_token;
  
  try {
    let res = await WeixinApi.getWXToken( "client_credential", 
                                appConfig.wx.AppID! , appConfig.wx.AppSecret! );

    if (res.status == 200  ){
      await  RedisClient.getInstance().setex(key, res.data.expires_in - 120, res.data.access_token);
      console.log("get wx token : %s , expires : %d" , res.data.access_token, res.data.expires_in);
      return res.data.access_token;
    }
    
  } catch (e) {
  }

  return "";  
  
}  
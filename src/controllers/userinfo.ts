import { promises } from "dns";
import { BaseContext, Next } from "koa";
import  {Context} from 'koa';
import jwt from 'jsonwebtoken';
import { WXUser ,AutoLoginResult, getTelephoneResult } from "../models/user-model";
import { appConfig } from '../config';
import mysql from 'mysql2/promise';
import mysqlPool from "../models/mysql-model";
 
import WeixinApi from "../api/weixin-api";
import RedisClient from '../models/redis-client';
import WXToken from "./wxtoken";

export default async (ctx: any) =>{  
  //获取session
  if (ctx.session.user)
  {
    //const user : AuthonTokenInfo = ctx.session.user;
    ctx.body = "userinfo new " ;//+ user.username;
  }
  else
    ctx.body = "userinfo new --  no login" ;
  
  console.log("userinfo new " + ctx.session.user);
}
 


export  async function getTelephone(ctx: Context) : Promise<void>{

  let { code , openid } = ctx.request.body as any;
  let ip:string =  ctx.request.ip;

  let wxUser : WXUser = {};

  try {
    wxUser = await RedisClient.getInstance().hgetall(`user:${openid}`);  

    let wxTokenStr = await WXToken();

    let res = await WeixinApi.getuserphonenumber( wxTokenStr , code);
 
    if (res.status == 200 &&  res.data.errcode == 0 ){

      wxUser.telephone = res.data.phone_info.phoneNumber;
      await RedisClient.getInstance().hset(`user:${openid}`, "telephone", wxUser.telephone!);  
      await RedisClient.getInstance().expire(`user:${openid}`, 60 * 60 * 6);

      console.log(res.statusText) ;
    }
    else{
      ctx.err = 502;
      ctx.body = { type: 'weixin interface has error' };
      ctx.msg = res.status + "|" + res.statusText + "|" +res.data.errcode + "|" +res.data.errmsg;
      return;
    }

  } catch (e) {
    ctx.err = 502;
    ctx.body = { type: 'weixin interface has error' };
    ctx.msg = (e as Error).name +":" +(e as Error).message;
    return;
  }
  
  
  let res : getTelephoneResult = {
    telephone : wxUser.telephone!
  }
  ctx.body = res;
  console.log("getTelephone: " +  JSON.stringify(ctx.body) );

}

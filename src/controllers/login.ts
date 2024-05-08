import  {Context} from 'koa';
import jwt from 'jsonwebtoken';
import { WXUser ,AutoLoginResult } from "../models/user-model";
import { appConfig } from '../config';
import mysql from 'mysql2/promise';
import mysqlPool from "../models/mysql-model";
 
import WeixinApi from "../api/weixin-api";
import RedisClient from '../models/redis-client';

export default async function login(ctx: Context) : Promise<void>{

  let { code , direct } = ctx.request.body as any;
  let ip:string =  ctx.request.ip;

  let wxUser : WXUser = {};
  try {
    
    let res = await WeixinApi.jscode2session( appConfig.wx.AppID! , appConfig.wx.AppSecret! , code , "authorization_code");

    if (res.status == 200){
      wxUser = await RedisClient.getInstance().hgetall(`user:${res.data.openid}`);  

      Object.assign(wxUser , res.data); 
      //console.log(res.statusText) ;
    }
    else{
      ctx.err = 502;
      ctx.body = { type: 'weixin interface has error' };
      ctx.msg = res.status + ":" + res.statusText;
      return;
    }

  } catch (e) {
    ctx.err = 502;
    ctx.body = { type: 'weixin interface has error' };
    ctx.msg = (e as Error).name +":" +(e as Error).message;
    return;
  }
  
  
  try {
    wxUser.auth_token = jwt.sign( {openid:wxUser.openid, session_key:wxUser.session_key} , 
                  appConfig.jwtConfig.secret,  { expiresIn: appConfig.jwtConfig.expiresIn } );

    //let { openid, ...user } = wxUser;
 
    await RedisClient.getInstance().hset(`user:${wxUser.openid}`, wxUser);  
    await RedisClient.getInstance().expire(`user:${wxUser.openid}`, 60 * 60 * 6);
      
  } catch (e) {
    ctx.err = 502;
    ctx.body = { type: 'data store has error' };
    ctx.msg = (e as Error).name +":" +(e as Error).message;
    return;
  }
  let res : AutoLoginResult = {
    auth_token: "",
    openid: ""
  };

  const { session_key, ...userWithoutSessionKey } = wxUser;
  Object.assign ( res , userWithoutSessionKey);
  

  // let res : AutoLoginResult = {
  //   openid     :wxUser.openid!,
  //   auth_token :wxUser.auth_token,

  //   wxUser.telephone,
  //   wxUser.nickName,
  //   gender?: string;
  //   language?: string;
  //   city?: string;
  //   province?:string;
  //   country?:string;
  //   avatarUrl?:string;

  // }
  ctx.body = res;
  console.log("login: " +  JSON.stringify(ctx.body) ); 
}


// async function getUser(openid: string): Promise<WXUser | null> {
//   const user = await redisClient.hGetAll(`user:${openid}`);

//   return Object.keys(user).length > 0 ? (user as WXUser) : null; // 返回用户数据或 null
// }
async function performTransactionalOperation() {
   
/**
 * 
 * 

  let connection = await mysqlPool.getConnection(); // 从连接池获取连接
     
  let sql = 'SELECT * FROM member where username like ? and id<?';
  let values = ['z%' , 3];
  let [rows, fields] = await connection.query<Member[]>( {sql, values , rowsAsArray: false} ); // 执行查询
  console.log(fields);

  if (Array.isArray(rows)) {
    let rowsCount = rows.length;  
    console.log("count %d",rowsCount);  

    rows.forEach( (row  :Member )=> {

      let userinfo: AuthonUser = {
        id      : row.id,
        nickname: row.nickname,
        username: row.username,
        email   : row.email
      }

     //let token = jwt.sign( {user:{userinfo}} , appConfig.jwtConfig.secret, 
     let token = jwt.sign( userinfo , appConfig.jwtConfig.secret,  { expiresIn: appConfig.jwtConfig.expiresIn } );
 
     try{ 
        console.log("appConfig %s" ,  JSON.stringify(appConfig));
     }catch(err){
       console.log("config err: " , err);
     }
     
        
      //设置session
      if (ctx.session)
      {
        ctx.session.user = userinfo ;
        console.log("ctx.session.user:%s" , ctx.session.user);
      }
      
      ctx.body = {
            routePath: '/admin',
            userInfo: {
              ...row,               
              token,
              refreshToken: ''
            } 
          }  
      console.log("login: " +  JSON.stringify(ctx.body) );
    });
  }
  connection.release();
 * 
 */


  let connection = await mysqlPool.getConnection(); // 获取连接
  
  
  
    /** Deleting the `users` table, if it exists */
    await connection.query<mysql.ResultSetHeader>('DROP TABLE IF EXISTS `users`;');

    /** Creating a minimal user table */
    const [creted , createfields ] = await connection.query<mysql.ResultSetHeader>( 
      'CREATE TABLE `users` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50), PRIMARY KEY (`id`));' );
    
    console.log('creted:', creted.affectedRows);
    console.log(createfields);

  /** Inserting some users */
  
  const [inserted , insertfield  ] = await connection.execute<mysql.ResultSetHeader>(
    'INSERT INTO `users`(`name`) VALUES(?), (?), (?), (?);',
    ['Josh', 'John', 'Marie', 'Gween']
  );
  
  console.log('Inserted:', inserted.affectedRows);
  console.log(insertfield );


  
  try {
    await connection.beginTransaction(); // 开始事务

    // 第一个SQL操作
    await connection.query('INSERT INTO users (name, age) VALUES (?, ?)', ['John', 30]);

    // 第二个SQL操作
    await connection.query('INSERT INTO orders (user_id, item) VALUES (LAST_INSERT_ID(), ?)', ['Book']);

    await connection.commit(); // 提交事务
  } catch (error) {
    await connection.rollback(); // 回滚事务
    console.error('Transaction failed:', error);
  } finally {
    connection.release(); // 释放连接
  }
}


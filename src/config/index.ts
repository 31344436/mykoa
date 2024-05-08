import path from "path";
import session from 'koa-session'; 
import {RedisStoreSession} from '../models/redis-stroe-session'

export interface configInterface {
  environment?: string; // 环境变量
  port:number;
  staticDir: string; // 静态资源路径
  uploadDir: string; //上传目录路径
  database: databaseInterface; // 数据库配置
  wx: wxInterface; // 微信小程序参数配置
  sessionOption:Partial<session.opts>,
  jwtConfig:jwtConfigInterface;
}


export interface jwtConfigInterface {
  expiresIn: string | number;
  secret: string;
  header: string | string[];
  unless: (string | RegExp)[];
} 
 

export interface databaseInterface {
  dbName: string; // 数据库名称
  host: string; // 数据库地址
  port: number; // 数据库端口
  user: string; // 数据库用户名
  password?: string; // 数据库密码
}
 
export interface wxInterface {
  AppID?: string; // AppID
  AppSecret?: string; // AppSecret
  LoginUrl?: string // 小程序登录请求地址
}
 

export const appConfig: configInterface = {
  environment: "prod",
  port:10088,
  staticDir: path.resolve('./static/'),  
  uploadDir: path.join(__dirname, './public/'),  
  database: {
    dbName: "mykoadb",
    host: "localhost",
    port: 3306,
    user: "zhangnu",
    password: "zhangnu123"
  },
  wx: {
    AppID: "wxba93fcd3fe8a95ef",
    AppSecret: "d67b687f4e90489b3563fdd5d7b4fbd1"
  },
  sessionOption:{
    key: 'koa:session',  // 这里是cookie的名字
    maxAge: 120000,      // 设置session的过期时间，单位毫秒 86400000
    overwrite: true,     // 是否覆盖已经存在的session
    signed: true,        // 签名
    rolling: false,      // 每次请求都重新设置一个session的过期时间
    renew: false,        // 在session即将过期时，是否重置session的过期时间
    autoCommit: true,    
    store: new RedisStoreSession({
      host: 'localhost',      // Redis 服务器地址
      port: 6379,             // Redis 端口
      //password: 'zhangnu123', // 如果需要密码验证
      }),   // 使用 Redis 存储器
    sameSite: false
  },
  jwtConfig:{
    expiresIn: '10h', //s
    secret: 'koa-project',
    header: 'auth-token',
    unless: [
      '/',
      '/favicon.ico',
      '/api/members/login',
      '/api/members/mobileLogin',
      '/api/index/login',
      '/login',
      /^\/static\//
    ]
  }
};
 
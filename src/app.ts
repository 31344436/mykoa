import Koa from 'koa'; 
import http, { Server } from 'http';
import userRouter from './routers'
import { appConfig } from './config';
import serve from 'koa-static';
import session from 'koa-session';
import koaBodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import resultFormat from './middlewares/resultFormat';
import logPerformance from './middlewares/logPerformance';
import checkToken from './middlewares/checkToken';
import mysqlPool from './models/mysql-model';

const app : Koa  = new Koa();
//以下处理的顺利，符合洋葱层叠原则，不可以移动前后顺序

//处理body数据为json格式
app.use(koaBodyParser( {enableTypes: ['json', 'form', 'multipart' , 'text']} ));

//虚拟路径中间件 && 静态目录中间件
console.log("静态目录地址:" + appConfig.staticDir);
app.use( mount('/static', serve(appConfig.staticDir)));

//执行请求的时间日志中间件
app.use(logPerformance);

//异常处理&数据格式归整中间件
app.use(resultFormat);

//session中间件,先后顺序有影响，一定要放到路由之前，还得放到token之前，因为在这里也要使用他！
app.keys = ['my-session-secret'];
app.use(session( appConfig.sessionOption  , app));

//登录身份验证token中间件
app.use(checkToken(appConfig.jwtConfig));
   
//路由中间件
app.use(userRouter().routes())
   .use(userRouter().allowedMethods());

//启动http服务
startServer();

function startServer(): void {
  let port :number = Number(appConfig.port) || 3000;;
  const server :Server = http.createServer(app.callback());
  //监听服务异常
  server.on('error', (err: Error) => {
    console.error(err.name + " " + err.message);  
    setTimeout(() => {
      server.close();
      server.listen(port); //重新监听
    }, 1000);
  });
 
  server.listen(port, () => {
    console.log('服务启动: http://127.0.0.1:' + port);
  });
 
  console.log("process.env.NODE_ENV:%s" , process.env.NODE_ENV);

  return ;
}

process.on('SIGINT', async () => {
  await (appConfig.sessionOption.store as any).quit();
  await mysqlPool.end();
  console.log("mysql pool end");
  process.exit();
});
// import { promises } from "dns";
// import  {Context} from 'koa';
// import jwt from 'jsonwebtoken';
// import { Member  } from "../models/user-model";
// import { appConfig } from '../config';
// import mysql from 'mysql2/promise';
// import mysqlPool from "../models/mysql-model";
// import { AuthonUser } from "../models/user-model";
 

// export default async function login(ctx: Context) : Promise<void>{
    

//   let { username , pwd } = ctx.request.body as any;
//   let ip:string =  ctx.request.ip;

//   let connection = await mysqlPool.getConnection(); // 从连接池获取连接
     
//   let sql = 'SELECT * FROM member where username like ? and id<?';
//   let values = ['z%' , 3];
//   let [rows, fields] = await connection.query<Member[]>( {sql, values , rowsAsArray: false} ); // 执行查询
//   console.log(fields);

//   if (Array.isArray(rows)) {
//     let rowsCount = rows.length;  
//     console.log("count %d",rowsCount);  

//     rows.forEach( (row  :Member )=> {

//       let userinfo: AuthonUser = {
//         id      : row.id,
//         nickname: row.nickname,
//         username: row.username,
//         email   : row.email
//       }

//      //let token = jwt.sign( {user:{userinfo}} , appConfig.jwtConfig.secret, 
//      let token = jwt.sign( userinfo , appConfig.jwtConfig.secret,  { expiresIn: appConfig.jwtConfig.expiresIn } );
 
//      try{ 
//         console.log("appConfig %s" ,  JSON.stringify(appConfig));
//      }catch(err){
//        console.log("config err: " , err);
//      }
     
        
//       //设置session
//       if (ctx.session)
//       {
//         ctx.session.user = userinfo ;
//         console.log("ctx.session.user:%s" , ctx.session.user);
//       }
      
//       ctx.body = {
//             routePath: '/admin',
//             userInfo: {
//               ...row,               
//               token,
//               refreshToken: ''
//             } 
//           }  
//       console.log("login: " +  JSON.stringify(ctx.body) );
//     });
//   }
//   connection.release();
  
// }


// async function performTransactionalOperation() {
   



//   let connection = await mysqlPool.getConnection(); // 获取连接
  
  
  
//     /** Deleting the `users` table, if it exists */
//     await connection.query<mysql.ResultSetHeader>('DROP TABLE IF EXISTS `users`;');

//     /** Creating a minimal user table */
//     const [creted , createfields ] = await connection.query<mysql.ResultSetHeader>( 
//       'CREATE TABLE `users` (`id` INT(11) AUTO_INCREMENT, `name` VARCHAR(50), PRIMARY KEY (`id`));' );
    
//     console.log('creted:', creted.affectedRows);
//     console.log(createfields);

//   /** Inserting some users */
  
//   const [inserted , insertfield  ] = await connection.execute<mysql.ResultSetHeader>(
//     'INSERT INTO `users`(`name`) VALUES(?), (?), (?), (?);',
//     ['Josh', 'John', 'Marie', 'Gween']
//   );
  
//   console.log('Inserted:', inserted.affectedRows);
//   console.log(insertfield );


  
//   try {
//     await connection.beginTransaction(); // 开始事务

//     // 第一个SQL操作
//     await connection.query('INSERT INTO users (name, age) VALUES (?, ?)', ['John', 30]);

//     // 第二个SQL操作
//     await connection.query('INSERT INTO orders (user_id, item) VALUES (LAST_INSERT_ID(), ?)', ['Book']);

//     await connection.commit(); // 提交事务
//   } catch (error) {
//     await connection.rollback(); // 回滚事务
//     console.error('Transaction failed:', error);
//   } finally {
//     connection.release(); // 释放连接
//   }
// }


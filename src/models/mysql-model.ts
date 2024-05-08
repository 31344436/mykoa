import { appConfig } from '../config';
import mysql from 'mysql2/promise'; // 导入 MySQL 模块



const mysqlPool = mysql.createPool({
    host: appConfig.database.host,
    user: appConfig.database.user,
    port: appConfig.database.port,
    password: appConfig.database.password,
    database: appConfig.database.dbName,
    connectionLimit: 10, // 设置连接池的最大连接数
  });

  console.log('mysql pool connect: [%s:%s]USER:%s DB:%s',
  appConfig.database.host,appConfig.database.port,
  appConfig.database.user,appConfig.database.dbName );

export default mysqlPool; // 导出连接池
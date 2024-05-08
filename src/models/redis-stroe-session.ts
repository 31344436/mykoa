import Redis,{RedisOptions} from 'ioredis';
import session from 'koa-session';  
   
  export class RedisStoreSession implements session.stores {
    private myRedisClient : Redis | null = null;

    constructor(opt: RedisOptions){
      // this.myRedisClient = new Redis({
      //   host: 'localhost',      // Redis 服务器地址
      //   port: 6379,             // Redis 端口
      //   password: 'zhangnu123', // 如果需要密码验证
      //   });
      this.myRedisClient = new Redis(opt);
      console.log('session redis connect: [%s:%s]',opt.host, opt.port );
    }
    
    async get(key: string, maxAge: session.opts["maxAge"], data: { rolling: session.opts["rolling"] }): Promise<any>{

      if (!this.myRedisClient) 
        return null;

      const res = await this.myRedisClient.get(key);
      console.log('get session: [%s]%s',key, res);
      if (!res) {
        return null;
      }
    
      try {
        return JSON.parse(res.toString());
      } catch (err :any ) {
        // ignore err
        console.log('parse session error: %s', err.message);
      }

    }

    
    async set(
        key: string,
        sess: Partial<session.Session> & { _expire?: number | undefined; _maxAge?: number | undefined },
        maxAge: session.opts["maxAge"],
        data: { changed: boolean; rolling: session.opts["rolling"] },
    ):  Promise<any>{

      if (!this.myRedisClient) 
        return;

      if (typeof maxAge === 'number') {
        maxAge = Math.ceil(maxAge / 1000);
      }
    
      let jsonSess = JSON.stringify(sess);
      if (maxAge) {
        console.log('SETEX %s %s %s', key, maxAge, jsonSess);
        await this.myRedisClient.setex(key, maxAge, jsonSess);
      } else {
        console.log('SET %s %s', key, jsonSess);
        await this.myRedisClient.set(key, jsonSess);
      }
    
      console.log('SET %s complete', key);
      
    }

     
    async destroy(key: string):  Promise<any>{
      if (!this.myRedisClient) 
        return;

      console.log('DEL %s', key);
      await this.myRedisClient.del(key);
      console.log('DEL %s complete', key);
    }
    

    async quit() : Promise<any> {
      if (!this.myRedisClient) 
        return;

      // End connection SAFELY
     
      await this.myRedisClient.quit();
      console.log('quit redis client');
    };

  }
 
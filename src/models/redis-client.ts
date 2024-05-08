import Redis,{RedisOptions} from 'ioredis';

export default class RedisClient {
 
  private static myRedisClient : Redis | null = null;

  public static getInstance(): Redis {
    if (!this.myRedisClient) {
       
      let opt: RedisOptions = {host: 'localhost',port: 6379}

      this.myRedisClient = new Redis(opt);
    }
    return this.myRedisClient;
  }
  
}


 
//import { AuthonTokenInfo } from '../models/user-model';
import jwt from 'jsonwebtoken';
import type { Context, Next } from 'koa';
import { appConfig } from '../config';
 

 

export default function (params: Partial<typeof appConfig.jwtConfig>) {
  
  const config = Object.assign(appConfig.jwtConfig, params, {
    unless: [...appConfig.jwtConfig.unless, ...(params.unless ?? [])]
  });

  return async function (ctx: Context, next: Next) {
    if ( config.unless.some(
        (c) =>
          (typeof c === 'string' && c === ctx.path) ||
          (typeof c !== 'string' && c.test(ctx.path))
    )) {
      await next();
      return;
    } 
      
    let auth_token: string | undefined = undefined;

    if (Array.isArray(appConfig.jwtConfig.header)) {
      for (const h of appConfig.jwtConfig.header) {
        if (ctx.headers[h]) {
          auth_token = ctx.headers[h] as string;
            break;
        }
      }
    } else 
    auth_token = ctx.headers[appConfig.jwtConfig.header] as string;
     
    if (!auth_token) 
    {
      ctx.err = 303;
      ctx.body = { type: 'need login' };
      ctx.msg = 'Not Authorized';
      return;
    }
   
    try {
      let secret = appConfig.jwtConfig.secret;
      const res = jwt.verify( auth_token,secret ) as jwt.JwtPayload;
        
      let auth_token_openid :string       = res.openid;
      let auth_token_session_key :string  = res.session_key;

      //以下代码不会走到，过期就直接throw了
      {
        let exp: number = res.exp ? res.exp : 0;
 
        if (exp < ( Date.now()/1000)) {
          ctx.err = 303;
          ctx.body = { type: 'The token has expired' };
          ctx.msg = 'The token has expired';
          return;
        }
      }
        
      let { openid } = ctx.request.body as any;
    
      if (openid && openid != auth_token_openid){
          ctx.err = 303;
          ctx.body = { type: 'The token mismatch' };
          ctx.msg = 'The token mismatch';
          return;
      }

      await next();

    } catch (e) {
      ctx.err = 303;
      ctx.body = { type: 'need login' };
      ctx.msg = (e as Error).name +":" +(e as Error).message;
      return;
    }     
  };
}

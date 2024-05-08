// import { AuthonUser } from '../models/user-model';
// import jwt from 'jsonwebtoken';
// import type { Context, Next } from 'koa';
// import { appConfig } from '../config';
 

 

// export default function (params: Partial<typeof appConfig.jwtConfig>) {
  
//   const config = Object.assign(appConfig.jwtConfig, params, {
//     unless: [...appConfig.jwtConfig.unless, ...(params.unless ?? [])]
//   });

//   return async function (ctx: Context, next: Next) {
//     if ( config.unless.some(
//         (c) =>
//           (typeof c === 'string' && c === ctx.path) ||
//           (typeof c !== 'string' && c.test(ctx.path))
//     )) {
//       await next();
//       return;
//     } 
      
//     let token: string | undefined = undefined;

//     if (Array.isArray(appConfig.jwtConfig.header)) {
//       for (const h of appConfig.jwtConfig.header) {
//         if (ctx.headers[h]) {
//             token = ctx.headers[h] as string;
//             break;
//         }
//       }
//     } else 
//       token = ctx.headers[appConfig.jwtConfig.header] as string;
     

//     if (!token || !ctx.session) 
//     {
//       ctx.err = 303;
//       ctx.body = { type: 'need login' };
//       ctx.msg = 'Not Authorized';
//       return;
//     }

   
//     try {
    
//       let tokenUser: AuthonUser | undefined = undefined;
//       let secret = appConfig.jwtConfig.secret;
//       const res = jwt.verify( token,secret ) as jwt.JwtPayload;
           
//       tokenUser = {
//         id      : res.id,
//         nickname: res.nickname,
//         username: res.username,
//         email   : res.email
//       };

//       //以下代码不会走到，过期就直接throw了
//       {
//         let exp: number = res.exp ? res.exp : 0;
 
//         if (exp < ( Date.now()/1000)) {
//           ctx.err = 303;
//           ctx.body = { type: 'The token has expired' };
//           ctx.msg = 'The token has expired';
//           return;
//         }
//       }
      
//       let sessionUser: AuthonUser | undefined = undefined;
//       if (ctx.session)
//         sessionUser =  ctx.session.user ;

//       if (!sessionUser || !tokenUser ||
//           sessionUser.id != tokenUser.id || 
//           sessionUser.email != tokenUser.email || 
//           sessionUser.nickname != tokenUser.nickname || 
//           sessionUser.username != tokenUser.username 
//         ){
//           ctx.err = 303;
//           ctx.body = { type: 'The token mismatch' };
//           ctx.msg = 'The token mismatch';
//           return;
//         }
//       } catch (e) {
//         ctx.err = 303;
//         ctx.body = { type: 'need login' };
//         ctx.msg = (e as Error).name +":" +(e as Error).message;
//         return;
//       }
//       await next();
//   };
// }

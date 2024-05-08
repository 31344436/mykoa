import type { Context, Next } from 'koa';
import { SuccessResultModel , ErrorResultModel} from '../models/result-model';

export default async function (ctx: Context, next: Next) {
  try {
    await next();

    const sc = ctx.headers["source-client"];     
    if (!sc || sc !=  'miniapp' )
      return;

    if (!ctx.body){
      ctx.body = new ErrorResultModel('Not Found', 404);
      return;
    }
    
    ctx.body = new SuccessResultModel(
          ctx.body,
          ctx.err ?? 1,
          ctx.msg ?? undefined
    );
          
  } catch (err: any) {
    if (err.code == 'P2003') {
      // Foreign key constraint failed
      ctx.body = new ErrorResultModel('资源有关联，操作失败', 601);
    } else {
      const status = ctx.status || err.statusCode || err.status || 500;
      ctx.body = new ErrorResultModel(err.message + " " + err.code , status, ctx.body);
    }
    console.error('error : %s ', ctx.body );
    
  }
}

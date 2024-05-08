import type { Context, Next } from 'koa';

const currentDateTime = () => {
  const now = new Date();
  return (
    now.getFullYear() +
    '-' +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    now.getDate().toString().padStart(2, '0') +
    ' ' +
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0') +
    ':' +
    now.getSeconds().toString().padStart(2, '0') +
    '.' +
    now.getMilliseconds().toString().padStart(3, '0')
  );
};

export default async function (ctx: Context, next: Next) {
  const start = new Date().getTime();
  // const inputBody = ctx.request.body;
  await next();
  // const outputBody = ctx.body;
  const ms = new Date().getTime() - start;
  console.log(`${currentDateTime()} ${ctx.method} ${ctx.url} - ${ms}ms`);
  // console.log('resquest', inputBody);
  // console.log('response', outputBody);
}

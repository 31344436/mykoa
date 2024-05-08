/**
 * 获取文件夹下所有文件名
 *
 * @export
 * @param {string} dir
 * @returns
 */

import {readdirSync , statSync , existsSync} from 'fs';

export function getFiles(dir: string): string[] {
  let res: string[] = [];
  
  const exist = existsSync(dir);

  if (!exist) 
    return res;

  const files = readdirSync(dir);
  for (const file of files) {
    const name = dir + "/" + file;
    if (statSync(name).isDirectory()) {
      const tmp = getFiles(name);
      res = res.concat(tmp);
    } else {
      res.push(name);
    }
  }
  return res;
}
 
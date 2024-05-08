/**
 * 小程序用户
 */
import {RowDataPacket} from 'mysql2/promise';


// export interface AuthonTokenInfo  {
//   UnionID: number;
//   username: string;
//   nickname: string;
//   email: string;
// }



export interface WXUser  {
  openid?:string;
  session_key?:string;
  unionid?:string;
  auth_token?:string;

  telephone?:string;
  nickName?: string;
  avatarUrl?:string;

  gender?: string;
  language?: string;
  city?: string;
  province?:string;
  country?:string;
}



export interface Member  extends RowDataPacket {
  /**
   * id
   */
  id: number;
  /**
   * 用户名，账号/openid
   */
  username: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 手机号
   */
  mobile?: string;
  /**
   * 角色,0=普通用户，其他取值按业务需要定义
   */
  role: string;
  /**
   * 可扩展内容
   */
  detail?: any;
  /**
   * 创建时间
   */
  createdAt?: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * 状态，0=禁用，1=激活
   */
  status: string;
  /**
   * First Name
   */
  firstName?: string;
  /**
   * Last Name
   */
  lastName?: string;
  /**
   * Title
   */
  title?: string;
  /**
   * 站点
   */
  website?: string;
  /**
   * 营业编号
   */
  dedNo?: string
  /**
   * 经纪人编号
   */
  brnNo?: string
  /**
   * 不动产登记号
   */
  reraNo?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 所属公司id
   */
  agencyId?: number
}


export interface AutoLoginResult  {
  openid: string;
  auth_token:string;
  unionid?:string;
  
  telephone?:string;
  nickName?: string;
  avatarUrl?:string;

  gender?: string;
  language?: string;
  city?: string;
  province?:string;
  country?:string;
}

export interface getTelephoneResult  {
  telephone: string;
}

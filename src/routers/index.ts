import Router from "koa-router";
import login from "../controllers/login";
import  userinfo,{getTelephone} from "../controllers/userinfo";
//import getTelephone from "../controllers/gettelephone"

export default function userRouter() : Router {

  let route = new Router();
 
  route.post('/login',  login );
  route.post('/gettelephone', getTelephone);

  //Nouse
  route.post('/userinfo',userinfo);
  route.post('/register', login);
  
  
  return route;
}
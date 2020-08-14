import cookie from 'js-cookie';

import axios from '../request/index'
import {UserType} from '../utils/user_auth'
export default {
        data(){
            return{
                msg:'乐哥威武',
                cookie,
                UserType
            }
        },
        methods:{
            $setCookie(cookieObj,options){
                Object.keys(cookieObj).forEach(k=>{
                    cookie.set(k,cookieObj[k],options)
                })
            },
            $removeCookie(keys){
              Object.keys(keys).forEach(k=>{
                  cookie.remove(keys[k])
              })
            },
            $get(url,params){
                return axios.get(url,{params})
            },
            $post(url,params){
                return axios.post(url,params)
            }
        }
}
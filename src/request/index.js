import axios from 'axios'
import NProgress from 'Nprogress'
import 'nprogress/nprogress.css'
import  _ from "../../public/le"
// import qs from 'qs' qs.stringify
// 创建实例时设置配置的默认值
var instance = axios.create({
    baseURL: '/'
});

let qs = {
    stringify(obj){
        return Object.keys(obj).map(r=> r+"="+obj[r]).join('&')
    }
}

function fmtParams(method,params,data){
    if (method==='get'){
        if (!params){
            return ''
        } else {
            return qs.stringify(params)
        }
    }else {
        if (!data)return ''
        return _.convertObj2Str(data)

    }
}
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    let {method,url,params,data} = config
    let str = fmtParams(method,params,data)
    console.log('='.repeat(20))
    console.log(`${method}了${url}，参数为${str}`)
    console.log('='.repeat(20))
    // 在发送请求之前做些什么
    NProgress.start()
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    NProgress.done();
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// export   function get(url,params) {
//         return axios.get(url,{params})
//
// }

export const get =(url,params)=>axios.get(url,{params})
export const post = (url,params)=>axios.post(url,params)
// export   function post(url,params) {
//     return axios.post(url,params)
//
// }

export default  instance
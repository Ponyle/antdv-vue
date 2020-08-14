import  msg  from "../mixin/index";
import '../../public/le'
import filter from './filter'
import directives  from "./directives";
export default {
    install(Vue){
        Vue.mixin(msg)
        //自定义指令

        Object.keys(directives).forEach(r=>{

            Vue.directive(r, directives[r])})


        //自定义过滤器
        Object.keys(filter).forEach(r=>{
            Vue.filter(r,filter[r])
        })
    }
}
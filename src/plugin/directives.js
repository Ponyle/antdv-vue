import cookie from 'js-cookie';
export default {

    limit(el,data){
        el.title = el.innerHTML
        el.innerHTML =  el.innerHTML.substring(0,data.value)+"..."
    },


    auth(el,data){
        if (  cookie.get('user_type')!==data.value){
           el.style.display='None'
        }
    }


}
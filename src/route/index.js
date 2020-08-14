import Vue from 'vue'
import VueRouter from 'vue-router'
import cookie from 'js-cookie'
Vue.use(VueRouter)
import NProgress from 'Nprogress'
import 'nprogress/nprogress.css'
import {UserType} from '../utils/user_auth'

const routes = [
    {
        path:"/",
        component:()=>import('../components/Layout'),
        children:[
            {
                name:"工作站",
                path:"/",
                meta: {"title":"工作站"},
                component:()=>import('../components/Home')
            },
            {
                path:"/shiting",
                module: "用户管理",
                meta:{"title":"试听管理"},
                name:'用户管理',
                component:()=>import('../components/user/Shiting')
            },
            {
                path:"/jiaoshi",
                module: "用户管理",
                meta:{
                    "title":"教师管理",
                    "user_perssion":UserType.ADMIN
                },
                name:'用户管理',
                component:()=>import('../components/user/Jiaoshi')
            },
            {
                path:"/link",
                module: "网站管理",
                meta:{"title":"友情链接"},
                name:'网站管理',
                component:()=>import('../components/webpage/Link')
            },

            {
                path:"/article",
                module:"内容管理",
                name:'内容管理',
                meta:{"title":"文章管理"},
                component:()=>import('../components/webpage/Article')
            },
            {
                inMenu:true,
                path:"/add_news",
                name:"添加文章",
                meta:{"moren":"/article",module:"内容管理",},
                component:()=>import('../components/webpage/Addnews')
            },

            //不采用Prop
            // {
            //     path:"article_detail/:id",
            //     name:'lele',
            //     component:()=>import('../components/webpage/ArticleDetail')
            // }
            // 采用prop
            {
                path:"/article_detail/:id",
                name:"预览文章",
                meta:{"moren":"/article",module:"内容管理",},

                props:true,
                inMenu:true,
                component:()=>import('../components/webpage/ArticleDetail')
            },
            {
                path:"/edit_article/:id",
                name:"编辑文章",
                meta:{"moren":"/article",module:"内容管理"},
                props:true,
                inMenu:true,
                component:()=>import('../components/webpage/EditArticle')
            },

        ]
    },
    {
        path: '/403forbin',
        name: 'error1',
        inMenu:true,
        component: ()=>import('../components/403Forbin')
    },
    {
        path: '*',
        name: 'error',
        inMenu:true,
        component: ()=>import('../components/Error')
    },

    {
        path: "/login",
        inMenu:true,
        name:"登录",
        component:()=>import('../components/Login')
    },



]

function routeinit(routelist){
    routelist.forEach(r=>{
        if (!r.meta) r.meta = {}
        if (r.children){
            routeinit(r.children)
        }

    })
}

routeinit(routes)


const router = new VueRouter({
    mode:'history',
    routes
})
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ||  to.name
    NProgress.start();
    if (to.meta.user_perssion && to.meta.user_perssion!==cookie.get('user_type')){
        next('/403forbin')
    }
    if(to.path!=="/login"){
        if(cookie.get('username')){
            next()
        }else {
            next("/login")
        }
    }
    next()
})

router.afterEach((to,from)=>{
    NProgress.done();
})


export default router
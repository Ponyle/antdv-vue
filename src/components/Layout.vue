<template>
        <a-layout id="common">
            <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
                <div class="logo" >{{!collapsed?"LEGE微课小工坊":"LEGE"}}</div>
                <a-menu theme="dark" mode="inline" :open-keys="openKeys"  :selectedKeys="moren"  @openChange="onOpenChange"  :defaultSelectedKeys="[default_url]">
                    <template v-for="(item) in menuList">
                        <a-menu-item v-if="!item.children" :key="item.path" >
                            <router-link :to="item.path"><a-icon type="mail" /> <span>{{item.title.title}}</span></router-link>
                        </a-menu-item>
                        <a-sub-menu :key="item.title" v-else  >
                            <span slot="title"><a-icon :type="item.title | conicon" /><span>{{item.title}}</span></span>
                            <a-menu-item v-for="ls in item.children" :key="ls.path" >
                                <router-link :to="ls.path">{{ls.meta.title}}</router-link>
                            </a-menu-item>
                        </a-sub-menu>
                    </template>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-header class="ban_top flex a-c j-s" >
                    <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)"/>
                    <a-dropdown style="padding-right: 100px">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-avatar :size="52" icon="user" src="http://localhost:8080/static/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200802164444.jpg" />
                            {{this.cookie.get('username')}}
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:">修改密码</a>
                            </a-menu-item>
                            <a-menu-item>
                                <div  @click="logout">注销</div>
                            </a-menu-item>

                        </a-menu>
                    </a-dropdown>
                </a-layout-header>
                <a-layout-content  :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                    <a-breadcrumb >

                        <a-breadcrumb-item>  <router-link to="/">首页</router-link></a-breadcrumb-item>
                        <a-breadcrumb-item >{{bride}}</a-breadcrumb-item>
                        <a-breadcrumb-item v-if="brides">{{brides}}</a-breadcrumb-item>
                    </a-breadcrumb>
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>


</template>
<script>
    // import {set} from "../../../../vue-devtools-dev/packages/shared-utils/src/util";

    export default {
        data() {
            return {
                extralist:[],
                moren:[],
                bride:"",
                brides:"",
                default_url:'',
                rootSubmenuKeys: [],
                openKeys: [],
                collapsed: false,
                menuList:[],
            };
        },
        filters:{
            conicon(val){
                if(val==='用户管理')return 'user'
                if (val==='网站管理') return 'global'
                if (val==='内容管理') return 'project'
                if (val==='测试管理') return  'user'
            }
        },
        watch:{
            $route(){
                this.routeinit()
            }
        },
        created() {

            this.routeinit()
            let route = this.$router.options.routes
            // route.filter(r=>!r.inMenu).forEach(r=> {
            //
            //     this.menuList = r.children.filter(rr=>rr.inMenu)
            // })
            let arr  = route.filter(r=>!r.inMenu && !r.meta.user_perssion || this.cookie.get('user_type')===r.meta.user_perssion ) //拿到layout的所有具有module的不隐藏的子路由,b并且具有权限
            let submenu = arr[0].children.filter(r=>r.module && !r.inMenu && !r.meta.user_perssion || this.cookie.get('user_type')===r.meta.user_perssion)
            this.extralist = submenu.map(r=>r.path)
            //拿到所有的模板的名称
            let modulename = submenu.map(r=>r.module||"")
            // 将模板名称去重
            let lsls = []
            let modulelist = [...new Set(modulename)]
             modulelist.forEach(r=>{
                if (r===""){
                    return
                }else {
                    lsls.push(r)
                }
            })
            // 从所有子路由中找到本模板的子路由
            let sortmodulelist = lsls.map(r=>{
                return{
                    title:r,
                    children:submenu.filter(rr=>rr.module===r)
                }
            })


            this.rootSubmenuKeys = lsls


            let msg = arr[0].children.filter(r=>!r.inMenu && !r.module).map(rr=>{
                return {title:rr.meta,path:rr.path}
            })
            this.menuList.push(...msg,...sortmodulelist)

            // 正过来操作 layout
            if (this.$route.name){

                if(this.$route.meta.moren){
                    this.moren=[this.$route.meta.moren]
                    this.openKeys = [this.$route.meta.module]
                    this.default_url = this.$route.meta.moren

                }else {
                    this.openKeys = [this.$route.name]
                    this.default_url = this.$route.path
                    this.moren = [this.default_url]


                }
            }
        },
        methods: {
            routeinit(){
                // 反过来操作 layout
                if (this.$route.name){

                    if(this.$route.meta.moren){
                        this.moren=[this.$route.meta.moren]
                        this.openKeys = [this.$route.meta.module]
                        this.default_url = this.$route.meta.moren

                    }else {
                        this.openKeys = [this.$route.name]
                        this.default_url = this.$route.path
                        this.moren = [this.default_url]
                    }
                }
                    // 操作面包屑
                    this.bride = this.$route.name
                    this.brides = this.$route.meta.title

            },

            // submenu的只存在一个缩进
            onOpenChange(openKeys) {
                const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
                if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                    this.openKeys = openKeys;
                } else {
                    this.openKeys = latestOpenKey ? [latestOpenKey] : [];
                }
            },
            logout(){
                // this.cookie.remove("username")
                this.$router.push("/login")
                this.$removeCookie(['username','user_type'])

            }
        },
    };
</script>
<style>
    #common{
        height: 100vh;
    }
    #common .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;
    }

    #common .trigger:hover {
        color: #1890ff;
    }

    #common .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
        overflow: hidden;
        text-align: center;
        color: #fff;
        font-size: 16px;
        line-height: 32px;
    }
    .ban_top{
        background: #fff;
        padding: 0;
    }
</style>

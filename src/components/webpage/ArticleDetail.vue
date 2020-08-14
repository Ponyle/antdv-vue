<template>
    <div >

        <h1 class="main-title">{{result.title }}</h1>

        <div>
            <span v-cloak style="font-size: 16px;color: #888;">发布时间：{{result.ctime | fmtTime  }}</span>
            <span style=" font-size: 16px;color: #888;padding:0 18px">作者：{{result.author}}</span>
        </div>
        <div style="margin-top:20px" v-html="result.desc"></div>



    </div>
</template>

<script>
    import   "../../../public/le"
    export default {
        name: "ArticleDetail",
        props:['id'],
        filters:{
            capitalize(val){
                if (val===''){
                    return '暂无数据'
                }else {
                    return  val
                }

            }
        },
        data(){
            return{
                result:[]
            }
        },
        created() {
            this.init()
        },
        methods:{
            async init(){
                let res = await this.$post('/preview_article',{id:this.id})
                this.result = res.data.msg
            }
        }
    }
</script>

<style scoped>
   .main-title{
       text-align: center;
       font-weight: bold;
       font-size: 30px;
   }
</style>
<template>
    <div >
        <div  style="padding: 10px">
            <router-link to="add_news">
                <a-button icon="plus"  type="primary" >
                    添加文章
                </a-button>
            </router-link>
        </div>
        <a-table  :columns="columns" rowKey="id" :data-source="data" :pagination="false" :locale="{emptyText:'暂无数据'}">
        <span slot="action" slot-scope="text,record">
                  <a-button @click="preview(record.id)">预览</a-button>
            <a-divider type="vertical"/>

      <a-button @click="edit_link(record.id)">编辑</a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" @click="del(record.id)">删除</a-button>
        </span>

        </a-table>

    </div>
</template>
<script>
    function sorts(val) {
            return {'1':'类别1','2':'类别2'}[val]
    }
    import   "../../../public/le"
    const columns = [
        {
            title: '编号',
            dataIndex: "id",
            key: "id",
        },
        {
            title: '文章标题',
            dataIndex: 'title',
            key: 'title',
            scopedSlots: {customRender: 'title'},

        },
        {
            title: '分类',
            dataIndex: 'sort_id',
            key: 'sort_id',
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '操作',
            key: 'cz',
            dataIndex: 'cz',
            scopedSlots: {customRender: 'action'},
        },
    ];
    export default {
        data() {
            return {
                other: '',
                form: {
                    id:'',
                    title: '',
                    sort_id: '',
                    author:'',
                    desc:'',
                },
                data: [],
                totaldata:[],
                columns,
                totalCount: 0,
                current: 1,
                pageSize: 6,
                visible: false,
                confirmLoading: false,
            };
        },
        created() {
            this.init()
        },
        methods: {
            async init(){
               let res =  await  this.$get('/init_article')
                this.data = res.data
                this.data.forEach(r=>{
                    r['sort_id'] = sorts(r['sort_id'])
                })

            },
            preview(id){
                // 不采用 prop=true
                // this.$router.push({
                //     path:'/article_detail',
                //     name:'lele',
                //     params: {
                //     ss:id
                //     }})


                // 采用 prop = true
                this.$router.push('article_detail/'+id)
            },
            edit_link(id){
                this.$router.push('edit_article/'+id)
            }
        }
    };
</script>

<style >
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
    .ant-upload-picture-card-wrapper {
        zoom: 1;
        display: inline-block;
        width: 50%;
    }
</style>

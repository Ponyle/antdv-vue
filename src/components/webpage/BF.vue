<template>
    <div>
        <div  style="padding: 10px">
            <a-button icon="plus"  type="primary" @click="openLink">
                添加链接
            </a-button>
        </div>
        <div>
            <a-modal cancelText="取消"  :okText="edit?'保存':'添加'" :title="edit?'编辑链接':'添加链接'" :visible="visible" :confirm-loading="confirmLoading"  @ok="!edit?onSubmit('form'):upSubmit('form')" @cancel="resetForm('form')">
                <div>
                    <a-form-model
                            ref="form"
                            :model="form"
                            :rules="rules"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol">
                        <a-form-model-item ref="name" label="名称" prop="name">
                            <a-input v-model="form.name" />
                        </a-form-model-item>
                        <a-form-model-item ref="link" label="网址" prop="link">
                            <a-input v-model="form.link" />
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-modal>
        </div>
        <a-table  :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="action" slot-scope="text,record">
      <a-button @click="update_link(record.id)">编辑</a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" @click="del(record.id)">删除</a-button>
        </span>
            <span slot="path" slot-scope="path">
                <a  target="_blank" :href="path">{{path}}</a>
            </span>
            <span slot="ctime" slot-scope="ctime">{{ctime|fmtTime}}</span>
        </a-table>

    </div>
</template>

<script>
    import   "../../../public/le"
    const columns = [
        {
            title: '编号',
            dataIndex: "id",
            key: "id",
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '网址',
            dataIndex: 'link',
            key: 'link',
            scopedSlots: {customRender: 'path'},

        },
        {
            title: '日期',
            key: 'ctime',
            dataIndex: 'ctime',
            scopedSlots: {customRender: 'ctime'},
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
            let checkTel = (rule, value, callback) =>{
                if (!value) {
                    return callback(new Error('手机号码不能为空'));
                }
                if (value) {
                    var myreg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
                    if (myreg.test(value)){
                        callback()
                    }else {
                        callback(new Error('亲 网址格式不对'));
                    }
                }
            }
            return {
                edit:true,
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                other: '',
                form: {
                    name: '',
                    region: undefined,
                    date1: undefined,
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    age:'',
                    link:'',
                    address:'',
                    id:''
                },
                rules: {
                    name:[{ required: true, message: '姓名不能为空', trigger: 'change' },],
                    link:[{ required:true,validator: checkTel, trigger: 'blur' }],
                },
                data: [],
                totaldata:[],
                columns,
                visible: false,
                confirmLoading: false,
            };
        },
        created() {
            this.init()
        },
        watch: {
            current() {
                this.init()
            }
        },
        methods: {
            async init() {
                let res = await this.$get('/link')
                // let total_user = await this.$get('/user', {pageIndex: this.current, pageSize: this.pageSize})
                this.totaldata = res.data
                if (res.data && res.data.length) {
                    this.data = res.data
                }else {
                    this.data = []
                }
            },
            async del(id) {
                this.$confirm({
                    title: '您 确定要删除吗?',
                    content: '乐哥',
                    okText: '删除',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: async () => {
                        let msg = await this.$post('/del_link', {id})
                        let state = msg.data.state
                        if (state) {
                            this.$message.success('删除成功')
                            this.init()
                        }else {
                            alert(1)
                        }
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });

            },
            onSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {

                        let name = this.form.name
                        let link = this.form.link
                        let res = await this.$post('/add_link',{name:name,link:link})
                        let state = res.data.success
                        if (state) {
                            this.$message.success('添加成功')
                            this.visible = false
                            this.init()
                        }
                    }
                    else {

                        return false;
                    }
                });
            },
            async upSubmit(formName) {
                let name = this.form.name
                let link = this.form.link
                let id = this.form.id
                let res = await this.$post('/update', {id: id, name: name, link: link,})
                if (res.data.success){
                    this.$message.success('保存成功')
                    this.visible = false
                    this.$refs[formName].resetFields();
                    this.init()
                }
            },
            resetForm(formName){
                this.visible = false
                this.$refs[formName].resetFields();

            },
            openLink(){
                this.edit = false
                this.visible = true
            },
            async update_link(id){
                this.edit = true
                this.visible = true
                let res =  await this.$post('/edit_link',{id})
                let msg = res.data.msg
                this.form['name'] = msg.name
                this.form['link'] = msg.link
                this.form['id'] = id

            }
        }
    };
</script>
<style scoped>
</style>
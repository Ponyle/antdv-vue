<template>
    <div >
        <div  style="padding: 10px">
            <a-button icon="plus"  type="primary" @click="visible=true">
                添加试听
            </a-button>

            <a-button icon="download"  type="primary" @click="exportExcel" style="margin-left: 20px" >
                导出Excel
            </a-button>
        </div>
        <div>
            <a-modal cancelText="取消"  okText="添加" title="Title" :visible="visible" :confirm-loading="confirmLoading"  @ok="onSubmit('form')" @cancel="resetForm">
                <div>
                    <a-form-model
                            ref="form"
                            :model="form"
                            :rules="rules"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol">
                        <a-form-model-item ref="name" label="姓名" prop="name">
                            <a-input v-model="form.name" />
                        </a-form-model-item>
                        <a-form-model-item ref="age" label="Age" prop="age">
                            <a-input v-model.number="form.age" />
                        </a-form-model-item>

                        <a-form-model-item  ref="tel"  prop="tel"  label="电话">
                            <a-input  v-model.number="form.tel"  />
                        </a-form-model-item>
                        <a-form-model-item   label="地址">
                            <a-input  v-model.number="form.address"  />
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-modal>
        </div>
        <a-table  :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="action" slot-scope="text,record">
      <a-button>发送手机短信</a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" @click="del(record.id)">删除</a-button>
        </span>
            <span slot="ctime" slot-scope="ctime">{{ctime | fmtTime}}</span>
        </a-table>
        <div class="flex j-c a-c" style="padding: 20px">
            <a-pagination v-model="current" :total="totalCount" :defaultPageSize="pageSize"/>
        </div>
    </div>
</template>
<script>
    import {export_json_to_excel} from './Export2Excel.js'
    import   "../../../public/le"
    const columns = [
        {
            title: '编号',
            dataIndex: "id",
            key: "id",


        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '电话',
            key: 'tel',
            dataIndex: 'tel',
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
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
            let checkPending;
            let checkAge = (rule, value, callback) => {
                clearTimeout(checkPending);
                if (!value) {
                    return callback(new Error('年龄不能为空'));
                }
                checkPending = setTimeout(() => {
                    if (!Number.isInteger(value)) {
                        callback(new Error('亲 您输入的是非数字哦'));
                    } else {
                        callback()
                    }
                }, 500);
            };
            let checkTel = (rule, value, callback) =>{
                if (!value) {
                    return callback(new Error('手机号码不能为空'));
                }
                if (!Number.isInteger(value)) {
                    callback(new Error('亲 您输入的是非数字哦'));
                } else {
                    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                    if (myreg.test(value)){
                        callback()
                    }else {
                        callback(new Error('亲 您输入手机号码格式不对'));
                    }
                }
            }
            return {
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
                    tel:'',
                    address:'',
                },
                rules: {
                    name:[{ required: true, message: '姓名不能为空', trigger: 'change' },],
                    age:[{ required:true, validator: checkAge, trigger: 'change' }],
                    tel:[{ required:true, validator: checkTel, trigger: 'change' }],
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
        watch: {
            current() {
                this.init()
            }
        },
        methods: {
            async init() {
                let res = await this.$get('/user', {pageIndex: this.current, pageSize: this.pageSize})
                // let total_user = await this.$get('/user', {pageIndex: this.current, pageSize: this.pageSize})
                this.totalCount = res.data.slice(-1)[0].total
                let totalres = await this.$get('/user', {pageIndex: 1, pageSize: this.totalCount})
                totalres.data.pop()
                this.totaldata = totalres.data
                res.data.pop()
                if (res.data && res.data.length) {
                    this.data = res.data
                } else {
                    if (this.totalCount === 0) {
                        this.data = []
                    }
                    if (this.current >= 1) {
                        this.current -= 1
                    }
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
                        let msg = await this.$post('/del', {id})
                        let state = msg.data.state
                        if (state) {
                            this.$message.success('删除成功')
                            this.init()
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
                        let age = this.form.age
                        let address  = this.form.address || '暂未填写地址哦'
                        let tel = this.form.tel
                        let res = await this.$post('/add',{name:name,age:age,address:address,tel:tel})
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
            resetForm() {
                this.visible = false;
                // this.$refs.ruleForm.resetFields();
            },
            exportExcel(){
                const tHeader = ['编号', '姓名', '年龄', '电话','地址', '时间']
                const filterVal = ['id', 'name', 'age', 'tel','address', 'ctime']
                //方法二
                let data = this.totaldata.map(r=>{
                    return filterVal.map(rr=>{
                        if (rr==='ctime') return new Date(r[rr]).getFormatText()
                        else return r[rr]
                    })
                })

                //方法一
                // let data = []
                // this.data.forEach(r=>{
                //     const msg = []
                //     filterVal.forEach(rr=>{
                //         if (rr==="ctime") r[rr] = new Date(r[rr]).getFormatText()
                //         msg.push(r[rr])
                //     })
                //     data.push(msg)
                // })
                export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'LEGE',
                    autoWidth: true,
                    bookType: 'xlsx'
                })
            },

        }
    };
</script>

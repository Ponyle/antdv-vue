<template>
    <div>

        <div style="padding: 10px">
            <a-button icon="plus" type="primary" @click="openLink" v-auth="UserType.ADMIN">
                添加试听
            </a-button>

            <a-button icon="download" type="primary" @click="exportExcel" style="margin-left: 20px">
                导出Excel
            </a-button>
        </div>
        <div>
            <a-modal cancelText="取消" :okText="edit?'保存':'添加'" :title="!edit?'添加试听':'修改试听'" :visible="visible"
                     :confirm-loading="confirmLoading" @ok="!edit?onSubmit('form'):upSubmit('form')"
                     @cancel="resetForm('form')">
                <div>
                    <div class="flex a-c ">
                        <a-upload
                                name="file"
                                list-type="picture-card"
                                class="avatar-uploader "
                                :show-upload-list="false"
                                action="/imglink"
                                :before-upload="beforeUpload"
                                @change="handleChange">

                            <img v-if="imageUrl" :src="imageUrl" alt="avatar"/>

                            <div v-else>
                                <a-icon :type="loading ? 'loading' : 'plus'"/>
                                <div class="ant-upload-text">
                                    Upload
                                </div>
                            </div>
                        </a-upload>
                        <div>
                            <a-avatar v-if="edit===true" style="border:1px solid #ccc" shape="square" :size="108"
                                      :src="'/static/images/'+this.form['img_name']"/>

                        </div>
                    </div>
                    <a-form-model
                            ref="form"
                            :model="form"
                            :rules="rules"
                            :label-col="labelCol"
                            :wrapper-col="wrapperCol">

                        <a-form-model-item ref="name" label="姓名" prop="name">
                            <a-input v-model="form.name"/>
                        </a-form-model-item>
                        <a-form-model-item ref="age" label="Age" prop="age">
                            <a-input v-model.number="form.age"/>
                        </a-form-model-item>

                        <a-form-model-item ref="tel" prop="tel" label="电话">
                            <a-input v-model.number="form.tel"/>
                        </a-form-model-item>
                        <a-form-model-item ref="address" prop="address" label="地址">
                            <a-input v-model.number="form.address"/>
                        </a-form-model-item>
                    </a-form-model>
                </div>
            </a-modal>
        </div>
        <a-table :columns="columns" rowKey="id" :data-source="data" :pagination="false">
        <span slot="action" slot-scope="text,record">
      <a-button @click="update_link(record.id)">编辑</a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" @click="del(record.id)">删除</a-button>
        </span>
            <span slot="img_name" slot-scope="img_name">

<!--                      <a-avatar :size="64" icon="user" :src="'/static/images/'+img_name" />-->
  <div class="demo-image__preview">
            <el-image
                    style="width: 60px; height: 60px;border-radius: 50%"
                    :src="'/static/images/'+img_name"
                    :preview-src-list="['/static/images/'+img_name]">
            </el-image>
        </div>
            </span>
            <span slot="ctime" slot-scope="ctime">{{ctime | fmtTime}}</span>
        </a-table>
        <div class="flex j-c a-c" style="padding: 20px">
            <a-pagination v-model="current" :total="totalCount" :defaultPageSize="pageSize"/>
        </div>
    </div>
</template>
<script>
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    import {export_json_to_excel} from './Export2Excel.js'
    import "../../../public/le"

    const columns = [
        {
            title: '编号',
            dataIndex: "id",
            key: "id",


        },
        {
            title: '头像',
            dataIndex: 'img_name',
            key: 'img_name',
            scopedSlots: {customRender: 'img_name'},

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
            let checkTel = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机号码不能为空'));
                }
                if (!Number.isInteger(value)) {
                    callback(new Error('亲 您输入的是非数字哦'));
                } else {
                    var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
                    if (myreg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('亲 您输入手机号码格式不对'));
                    }
                }
            }
            return {

                logo: '',
                edit: true,
                img_byte: '',
                imageName: '',
                infos: '',
                loading: false,
                imageUrl: '',
                labelCol: {span: 4},
                wrapperCol: {span: 14},
                other: '',
                form: {
                    name: '',
                    region: undefined,
                    date1: undefined,
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: '',
                    age: '',
                    tel: '',
                    address: '',
                    img: '',
                    img_name: ''
                },
                rules: {
                    name: [{required: true, message: '姓名不能为空', trigger: 'change'},],
                    age: [{required: true, validator: checkAge, trigger: 'change'}],
                    tel: [{required: true, validator: checkTel, trigger: 'change'}],
                },
                data: [],
                totaldata: [],
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
                let total = await this.$get('/total',)
                this.totalCount = total.data
                // let total_user = await this.$get('/user', {pageIndex: this.current, pageSize: this.pageSize})
                // this.totalCount = res.data.slice(-1)[0].total
                let totalres = await this.$get('/user', {pageIndex: 1, pageSize: this.totalCount})
                this.totaldata = totalres.data
                if (res.data && res.data.length) {
                    this.data = res.data
                } else {
                    this.data = this.totaldata

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
                        let address = this.form.address || '暂未填写地址哦'
                        let tel = this.form.tel
                        let img_name = this.imageName
                        let status = img_name
                        let res = await this.$post('/add', {
                            name: name,
                            age: age,
                            address: address,
                            tel: tel,
                            img_name: img_name,
                            status: status
                        })
                        let state = res.data.success
                        if (state) {
                            this.$message.success('添加成功')
                            this.$refs[formName].resetFields();
                            this.init()
                            this.visible = false
                            this.imageUrl = ""

                        }
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.imageUrl = ""
                this.visible = false;
                this.$refs[formName].resetFields();
            },
            exportExcel() {
                const tHeader = ['编号', '姓名', '年龄', '电话', '地址', '时间']
                const filterVal = ['id', 'name', 'age', 'tel', 'address', 'ctime']
                //方法二
                let data = this.totaldata.map(r => {
                    return filterVal.map(rr => {
                        if (rr === 'ctime') return new Date(r[rr]).getFormatText()
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
            openLink() {
                this.edit = false
                this.visible = true
            },
            handleChange(info) {
                this.imageName = info.file.name
                this.infos = info

                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }

                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, imageUrl => {
                        this.imageUrl = imageUrl;
                        this.loading = false;
                    });
                }
            },
            beforeUpload(file) {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    this.$message.error('You can only upload JPG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            },
            //编辑
            async update_link(id) {
                this.imageUrl = ""
                this.edit = true
                this.visible = true

                let res = await this.$post('/edit_listen', {id})
                let msg = res.data.msg

                this.form['name'] = msg.name
                this.form['age'] = msg.age
                this.form['address'] = msg.address
                this.form['tel'] = msg.tel
                this.form['img_name'] = msg.img_name

                this.form['id'] = id

                this.logo = msg.img_status
            },
            // 保存
            upSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let name = this.form.name
                        let age = this.form.age
                        let id = this.form.id
                        let address = this.form.address
                        let tel = this.form.tel

                        let img_name = this.imageName
                        if (img_name === "") img_name = this.logo
                        else img_name = this.imageName
                        let img_status = img_name

                        let res = await this.$post('/update_listen', {
                            id: id,
                            name: name,
                            age: age,
                            address: address,
                            tel: tel,
                            img_name: img_name,
                            img_status: img_status,
                        })
                        if (res.data.success) {
                            this.$message.success('保存成功')
                            this.imageName = ""
                            this.init()

                            this.visible = false
                            this.$refs[formName].resetFields();
                        }
                    } else {
                        return false
                    }
                })
            },

        }
    };
</script>

<style>
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

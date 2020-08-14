<template>
    <div id="app">


        <a-form :form="form" :label-col="{ span: 1}" :wrapper-col="{ span: 4 }" @submit="handleSubmit">
            <a-form-item label="标题">
                <a-input
                        v-decorator="['title', {initialValue:fin_title, rules: [{ required: true, message: '标题不能为空!' }] }]"/>
            </a-form-item>
            <a-form-item label="类别">
                <a-select
                        v-decorator="['sort',
          {initialValue:sort_num, rules: [{ required: true, message: '请选择类别!' }] }, ]"
                        placeholder="请选择"
                        @change="handleSelectChange">
                    <a-select-option value="1">
                        类别1
                    </a-select-option>
                    <a-select-option value="2">
                        类别2
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="内容">
                <div style="position: absolute; top: 40px; z-index: 999; left: 696px;">
                    <a-upload
                            list-type="picture"
                            action="/media_article"
                            :preview-file="handleChange"
                            :remove="removes"
                    >
                        <a-button type="link" >  上传视频 </a-button>
                    </a-upload>
                </div>
                <editor
                        v-model="msg"
                        api-key="99aahzfdw3u96q2q5eig8lynj0ko7vc182mcg636q8lbaudg"
                        :init="options"/>
                <div v-if="state" style="color: #f5222d;">内容不能为空!</div>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                <a-button type="primary" html-type="submit" style="margin: 15px">
                    保存
                </a-button>
                <a-button type="primary" @click="back">
                    返回
                </a-button>
            </a-form-item>
        </a-form>


    </div>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue'
    export default {
        props: ['value'],
        name: 'app',
        data() {
            return {
                ls:[],
                frameurl:"",
                media_urls:"",
                sort_num: "",
                fin_title: "",
                currentValue: this.value,
                state: false,
                msg: "",
                num: "",
                form: this.$form.createForm(this),
                options: {

                    language: 'zh_CN',
                    selector: 'textarea',
                    image_uploadtab: true,
                    images_upload_handler: async (blobInfo, success, failure, progress) => {
                        let formData = new FormData();
                        formData.append('file', blobInfo.blob(), blobInfo.filename());
                        let {data} = await this.$post('img_article', formData)
                        success("http://localhost:8888/static/news_img/" + data);
                    },
                    media_url_resolver: function (data, resolve/*, reject*/) {
                        let msg = JSON.parse(data.url)
                        if (msg.length<=1){
                            var embedHtml = '<iframe src="http://127.0.0.1:8888/static/media/' +msg[0]+
                                '" width="400" height="400" ></iframe>';
                            resolve({html: embedHtml});
                        }else {
                            var frameurl = ""
                            msg.forEach(r=>{
                                var embedHtml = '<iframe src="http://127.0.0.1:8888/static/media/' +r+
                                    '" width="800" height="600" ></iframe>';
                                frameurl+=embedHtml

                            })
                            resolve({html: frameurl});


                        }
                    },
                    file_picker_callback:(callback, value, meta)=> {
                        if (meta.filetype == 'file') {
                            callback('mypage.html', {text: 'My text'});
                        }

                        if (meta.filetype == 'image') {
                            callback('myimage.jpg', {alt: 'My alt text'});
                        }

                        if (meta.filetype == 'media') {

                            if(this.media_urls.length<=1){
                                if (!this.media_urls.length) this.$message.warning('请先上传视频')
                                else {
                                    callback(JSON.stringify([this.media_urls[0]]),{source2: 'alt.ogg', poster: 'image.jpg'});
                                }
                            }else {
                                callback(JSON.stringify(this.media_urls),{source2: 'alt.ogg', poster: 'image.jpg'});
                            }
                        }


                    },
                    media_live_embeds: true,

                    file_picker_types: 'file image media',
                    width: 800,
                    height: 500,
                    menubar: true,
                    plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                    toolbar: 'undo redo | formatselect | image | media | bold italic backcolor | \\alignleft aligncenter alignright alignjustify | \\bullist numlist outdent indent | removeformat |'
                }
            }
        },
        watch: {
            msg(val) {
                if (val !== '') {
                    this.state = false
                }
            }
        },
        created() {
            this.init()
        },
        methods: {
            removes(info){
                this.media_urls.remove(info.name)
                if (this.media_urls){
                    this.ls = []
                }

            },
            handleChange(info){
                this.ls.push(info.name)
                if (this.ls.length<=1){
                    this.media_urls = [info.name]

                }else {
                    this.media_urls = this.ls
                }

            },

            async init() {

                let id = this.$route.params.id
                this.num = 1
                let res = await this.$post('/edit_article', {id})
                let data = res.data.msg
                this.fin_title = data.title
                this.sort_num = data.sort_id
                this.msg = data.desc
            },

            handleSubmit(e) {

                e.preventDefault();
                if (this.msg === '') {
                    this.state = true
                }
                this.form.validateFields(async (err, values) => {
                    if (!err) {
                        if (this.msg === '') {
                            this.state = true
                        } else {
                            let id = this.$route.params.id
                            let title = values.title
                            let sort_id = values.sort
                            let desc = this.msg
                            let res = await this.$post('/update_article', {
                                id: id,
                                title: title,
                                sort_id: sort_id,
                                desc: desc
                            })
                            if (res.data.success) {
                                this.$router.push('/article')
                                return this.$message.success('保存成功')
                            }

                        }
                    }
                });
            },
            handleSelectChange(value) {
                console.log(value);
            },
            back() {
                this.$router.push('/article')
            }
        },
        components: {
            'editor': Editor
        }
    }
</script>
<style>
    .ant-upload-list-item{
        left: 103px;
        top: -50px;
        width: 190px;
    }
</style>

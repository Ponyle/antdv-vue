<template>
    <div id="app">
        <editor
                api-key="99aahzfdw3u96q2q5eig8lynj0ko7vc182mcg636q8lbaudg"
                :init="options"
        />
    </div>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue'

    export default {
        name: 'app',
        components: {
            'editor': Editor
        },
        data(){
            return{
                options:{
                    height: 500,
                    file_picker_types: 'file image media',
                    menubar: true,
                    media_live_embeds: true,
                    plugins: ['advlist autolink lists link image media charmap print preview anchor','searchreplace visualblocks code fullscreen','insertdatetime media table paste code help wordcount'],
                    toolbar: 'undo redo | formatselect | bold italic backcolor | \ alignleft aligncenter alignright alignjustify | \bullist numlist outdent indent | removeformat | help | media',
                    file_picker_callback:(callback, value, meta)=> {
                        if (meta.filetype == 'file') {
                            callback('mypage.html', {text: 'My text'});
                        }

                        if (meta.filetype == 'image') {
                            callback('myimage.jpg', {alt: 'My alt text'});
                        }

                        if (meta.filetype == 'media') {
                            callback('le.mp4',{source2: 'alt.ogg', poster: 'image.jpg'});
                        }


                    },
                    media_url_resolver: function (data, resolve/*, reject*/) {
                        if (data.url.indexOf('http://localhost:8888/static/media/16.mp4') !== -1) {
                            console.log(this)

                            var embedHtml = '<iframe src="' + data.url +
                                '" width="400" height="200" ></iframe>';
                            resolve({html: embedHtml});
                        } else {
                            this.ls = []
                            resolve({html: ''});
                        }
                    }
                }
            }
        }
    }
</script>

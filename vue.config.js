// module.exports = {
//     lintOnSave: false,
//     devServer: {
//         proxy: {
//             '/user': {
//                 target: 'http://localhost:6666',
//                 changeOrigin: true, // 允许跨域
//             }
//         }
//     }
// }

module.exports = {
    lintOnSave: false,
    devServer:{
        proxy:'http://localhost:8888'
    }
}
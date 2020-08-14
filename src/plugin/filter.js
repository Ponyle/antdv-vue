export default {
    fmtTime:val=>{
        return  new Date(val).getFormatText()
    },
    formatGender:(val)=>{
        return ['男','女'][val]
    }
}
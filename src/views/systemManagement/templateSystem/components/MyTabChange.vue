<template>
    <div :id="id">
      <slot></slot>
    </div>
</template>

<script>
  export default {
    name: "myTabChange",
    props: {
      "tableData":{
        required: true,
        type: Array
      },
      "id":{ // 自定义id
        type: String,
        default: 'mytabChange'
      }
    },
    data (){
      return {
        isEdit: false
      }
    },
    updated (){
      const _this = this;
      const tab = document.getElementById(_this.id);
      const button = tab.getElementsByTagName('button');
      for(let i=0; i < button.length; i++){
        button[i].setAttribute('mytabindex', -1)
      }
      document.onkeydown = function (e){ // isEdit 为false的时候 禁用tab
        if(!_this.isEdit && e && e.keyCode == 9){
          if(document.activeElement.getAttribute('mytablast') == 1){
            document.activeElement.blur()
            _this.$emit('mycb')
            if (e.preventDefault) { e.preventDefault(); }
            else { e.returnValue = false; }
          }else{
            if (e.preventDefault) { e.preventDefault(); }
            else { e.returnValue = false; }
          }
        }
      }
      document.onkeyup = function (e) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode == 9){ // 按 Esc
          if(_this.isEdit){
            if(document.activeElement.getAttribute('mytablast') == 1){ // 判断当前光标所在元素是否为可编辑最后一个
              _this.isEdit = false
              if (e.preventDefault) {
                e.preventDefault();
              }else {
                e.returnValue = false;
              }
            }else{
              document.activeElement.click() // select 触发下拉
            }
          }else{
            if (e.preventDefault) {
              e.preventDefault();
            }else {
              e.returnValue = false;
            }
          }
        }
      }
    },
    watch: {
      tableData:{ // 监听表格数据
        deep: true,
        handler(val){
          const _this = this;
          setTimeout(function () {
            val.map((item, index) => {
              if(item.isEditing && document.activeElement.getAttribute('mytablast') != 1){
                _this.isEdit = true;
                const row = document.getElementById(_this.id).querySelectorAll('.el-table__row')[index];
                const input = row.querySelectorAll('input');
                row.querySelectorAll('input')[row.querySelectorAll('input').length - 1].setAttribute('mytablast', 1)
                for(let i=0;i<input.length;i++){
                  if(i == input.length - 1){
                    break;
                  }
                  input[i].addEventListener('focus', function(){
                    _this.isEdit = true
                  })
                }
              }
            })
          }, 50)

        }
      }
    }
  }
</script>

<style scoped>
div{
  height: 100%;
}
</style>

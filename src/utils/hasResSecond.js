import store from "@/store";

const hasButton = {
  install(Vue,options){
    Vue.directive('hasButton',{
      inserted(el,binding){
        const {value} = binding;
        let buttons = store.getters && store.getters.buttons
        if(Array.isArray(value) && value.length > 0){
          const permission = value
          const hasPermission = buttons.some(button =>{
            return permission.includes(button)
          })

          if(!hasPermission){
            el.parentNode && el.parentNode.removeChild(el)
          }
        }else{
          throw new Error(`Like v-hasButton="['aaaa','bbbb']"`)
        }

      }
    })
  }
}

export default hasButton

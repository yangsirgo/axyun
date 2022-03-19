<template>
  <div class="templateSystem"  ref="page">
    <router-view></router-view>
  </div>
</template>

<script>
import adHeight from '@/mixins/adHeight'
export default {
  name: 'templateSystem',
  mixins:[adHeight],
  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style lang='scss' scoped>

</style>


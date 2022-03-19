<template>
  <div class="schedule" ref="page">
    <router-view></router-view>
  </div>
</template>

<script>
import adHeight from '@/mixins/adHeight'
export default {
  name: 'schedule',
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


<template>
  <div class="width100 height100">
    <flow-menu>
      <slot name="content"></slot>
    </flow-menu>
  </div>
</template>

<script>
import FlowMenu from "@/components/FlowMenu";

export default {
  name: "operatorReconciliation",
  components: {
    FlowMenu
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
</style>

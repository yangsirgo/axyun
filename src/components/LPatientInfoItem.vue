<template>
  <div class="patient-info">
    <div class="top">
      <slot name="top"></slot>
    </div>
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LPatientInfoItem",
};
</script>

<style lang="scss" scoped>
.patient-info {
  border: 1px solid $l-color-bgcolor-18;
  border-radius: $l-bg-radius-bg;
  overflow: hidden;
  & + & {
    margin-top: 5px;
  }
  .top {
    height: $l-height-common-3;
    line-height: $l-height-common-3;
    padding: 0 $l-padding-default-4;
    background-color: $l-color-bgcolor-18;
  }
  .bottom {
    background-color: $l-color-white;
    padding: $l-padding-default-2 $l-padding-default-4;
    line-height: 15px;
  }
  &:hover {
    border-color: $l-color-primary;
  }
  &.is-active {
    border-color: $l-color-primary;
    .top {
      background-color: $l-color-primary;
    }
  }
}
</style>

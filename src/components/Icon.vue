<template>
  <i
    :class="[{ iconfont: name }, 'vchat-noUser', className]"
    :style="{ fontSize: size + 'px', color: color, cursor: cursor }"
    @click.stop="clickIcon"
  />
</template>
<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 20
    },
    color: {
      type: String,
      default: '#5b5b5b'
    },
    cursor: {
      type: String,
      default: 'inherit'
    }
  },
  data() {
    return {}
  },
  computed: {
    className() {
      return 'icon-' + this.name
    }
  },
  methods: {
    clickIcon() {
      this.$emit('clickIcon')
    }
  }
}
</script>
<style lang="scss" scoped>
i {
  display: inline-block;
}
</style>

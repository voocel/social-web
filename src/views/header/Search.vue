<template>
  <div>
    <div class="head-search">
      <el-input
        v-model="searchText"
        class="search-item"
        placeholder="搜索用户或群组"
        prefix-icon="el-icon-search"
        clearable
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      searchText: ''
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .search-item .el-input__inner {
  background: rgb(245, 245, 245);
  height: 28px;
  width: 240px;
  font-size: 13px;
}
.head-search {
  float: left;
  background: #fff;
  text-align: center;
  font-size: 12px;
  height: 59px;
  padding-left: 15px;
  .search-item {
    width: 100%;
    height: 60px;
    line-height: 60px;
  }
}
</style>

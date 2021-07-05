<template>
  <div class="loading">
    <p class="image">
      <img src="../../images/loading.gif" /><span>加载中</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "loading",
};
</script>
<style scoped lang="scss">
/* 垂直居中的方案 translate */
.loading {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .image {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .image img {
    display: block;
    width: 80px;
    margin: 0 auto 10px;
  }
}
</style>
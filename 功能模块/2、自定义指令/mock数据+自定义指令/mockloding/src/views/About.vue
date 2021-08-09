<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div v-loading="loading">
      <p v-for="(item, index) of list" :key="index">{{ item.label }}:{{ item.value }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      list: [],
      loading: true,
    };
  },
  created() {
    // console.log(this.axios);
    setTimeout(this.getList, 3000);
    console.log('post请求--about页面');
    this.getPostList();
  },
  methods: {
    getList() {
      this.axios.get("api/list").then(({ data }) => {
        if (data.code === 500) {
          this.list = data.data;
          this.loading = false;
        }
      });
    },
    getPostList(){
      this.axios.post("api/list").then(res=>{
        console.log(res);
      })
    }
  },
};
</script>

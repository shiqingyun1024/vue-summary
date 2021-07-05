<template>
  <div class="hello" v-loading="isShow">
    <ul v-if="dataList.length > 0">
      <li v-for="data in dataList" :key="data">{{ data }}</li>
    </ul>
    <div v-else-if="dataList.length<1&&!isShow">暂无数据</div>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "list",
  data() {
    return {
      dataList: [],
      isShow:true
    };
  },
  created() {
    setTimeout(this.getList,3000)
    // this.getList()
  },
  methods: {
    getList() {
      axios.get("api/list").then(({data}) => {
        this.dataList = data.data
        this.isShow = false
      }).catch(err=>{
        this.isShow = false
        console.log(err);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

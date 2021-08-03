<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="text" v-model="username" />
    <p>{{ username }}</p>
    <!-- v-model等同于下面 :value和@input，是一个语法糖-->
    <br />
    <!-- type为text -->
    <input
      type="text"
      :value="username2"
      @input="username2 = $event.target.value"
    />
    <p>{{ username2 }}</p>
    <!-- type为checkbox -->
    <input type="checkbox" id="checkbox" v-model="checked" />
    <label for="checkbox">{{ checked }}</label>
    <br />
    <br />
    <input type="checkbox" id="checkbox2" :value="checked2" @change="change" />
    <label for="checkbox2">{{ checked2 }}</label>
    <br />
    <br />
    <!-- v-model="checkedNames" -->
    <!-- 在type="radio"上 v-model等于  @change="checkedNames=$event.target.value"-->
    <input
      type="radio"
      id="jack"
      value="Jack"
      @change="checkedName = $event.target.value"
    />
    <label for="jack">Jack</label>
    <input type="radio" id="john" value="John" v-model="checkedName" />
    <label for="john">John</label>
    <input type="radio" id="mike" value="Mike" v-model="checkedNam" />
    <label for="mike">Mike</label>
    <br />
    <br />
    <span>Checked names: {{ checkedName }}</span>
    <br />
    <br />
    <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
    <label for="jack">Jack</label>
    <input type="checkbox" id="john" value="John" v-model="checkedNames" />
    <label for="john">John</label>
    <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
    <label for="mike">Mike</label>
    <br />
    <span>Checked names: {{ checkedNames }}</span>
  </div>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      username: "",
      username2: "",
      checked: false,
      checked2: false,
      checkedName: "",
      checkedNames: [],
    };
  },
  methods: {
    // checked2=$event.target.value
    change(e) {
      {
        console.log(e.target.value);
      }
    },
  },
};
</script>

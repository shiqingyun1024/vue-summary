<template>
  <div class="about">
    <h1>This is an about page</h1>

    <!-- type为text -->
    <input type="text" v-model="username" />
    <p>username:{{ username }}</p>
    <!-- v-model等同于下面 :value和@input，是一个语法糖-->
    <br />
    <input type="text" :value="username2" @input="username2 = $event.target.value"/>
    <p>username2:{{ username2 }}</p>
    <br/>

    <!-- type为radio  通过v-model绑定，vue帮我们解决了分组问题，所以不用加name属性了。-->
    <input type="radio" id="jack" value="Jack" v-model="checkedName"/>
    <label for="jack">Jack</label>
    <input type="radio" id="john" value="John" v-model="checkedName"/>
    <label for="john">John</label>
    <p>checkedName:{{checkedName}}</p>
    <!-- v-model等同于下面 :checked和@change，是一个语法糖 这里注意一定要加name属性，name属性是用来分组的，这样就实现了单选。-->
    <input type="radio" id="jack" value="Jack" name="checkedName2" :checked="checkedName2=='jack'" @change="checkedName2=$event.target.value"/>
    <label for="jack">Jack</label>
    <input type="radio" id="john" value="John" name="checkedName2" :checked="checkedName2=='john'" @change="checkedName2=$event.target.value"/>
    <label for="john">John</label>
    <p>checkedName2:{{checkedName2}}</p>
    </br>
    
    <!-- type为checkbox -->
    <input type="checkbox" id="checkbox" v-model="checked" />
    <label for="checkbox">{{ checked }}</label>
    <br />
    <br />
    <input type="checkbox" id="checkbox2" :value="checked2" @change="change" />
    <label for="checkbox2">{{ checked2 }}</label>
    <br />
    <br />

    <!-- type="radio" -->
    <!-- <input type="radio" id="jack" value="Jack" @change="checkedName = $event.target.value"/>
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
    <span>Checked names: {{ checkedNames }}</span> -->
  </div>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      username: "",
      username2: "",
      checkedName: "",
      checkedName2: "",
      checked: false,
      checked2: false,
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

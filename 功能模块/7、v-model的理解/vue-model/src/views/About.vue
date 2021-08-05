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
    </br>
    <!-- v-model等同于下面 :checked和@change，是一个语法糖 这里注意一定要加name属性，name属性是用来分组的，这样就实现了单选。-->
    <input type="radio" id="jack" value="Jack" name="checkedName2" :checked="checkedName2=='jack'" @change="checkedName2=$event.target.value"/>
    <label for="jack">Jack</label>
    <input type="radio" id="john" value="John" name="checkedName2" :checked="checkedName2=='john'" @change="checkedName2=$event.target.value"/>
    <label for="john">John</label>
    <p>checkedName2:{{checkedName2}}</p>
    </br>
    
    <!-- type为checkbox -->
    <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
    <label for="jack">Jack</label>
    <input type="checkbox" id="john" value="John" v-model="checkedNames">
    <label for="john">John</label>
    <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
    <label for="mike">Mike</label>
    <br>
    <span>Checked names: {{ checkedNames }}</span>
    </br>
    </br>
    <!-- v-model等同于下面 :checked和@change，是一个语法糖 这里注意一定要加name属性，name属性是用来分组的，这样就实现了在一组内多选。 :checked="checkedNames2.includes('Jack')"-->
    <!-- 可以简单记作：cc（checked和change） 或者3c（checkbox，checked，change） -->
    <input type="checkbox" id="jack2" value="Jack" name="checkedNames"  @change="change(checkedNames2,$event)">
    <label for="jack2">Jack</label>
    <input type="checkbox" id="john2" value="John" name="checkedNames" v-model="checkedNames2">
    <label for="john2">John</label>
    <input type="checkbox" id="mike2" value="Mike" name="checkedNames" v-model="checkedNames2">
    <label for="mike2">Mike</label>
    <br>
    <span>Checked names: {{ checkedNames2 }}</span>
    </br>
    </br>

    <!-- 选择框 -->
    <!-- 单选时 -->
    <div id="example-5">
      <select v-model="selected">
        <option disabled value="">请选择</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
      </br>
      <span>Selected: {{ selected }}</span>
    </div>
    </br>
    </br>
    <!-- v-model等同于下面 :value和@change，是一个语法糖-->
    <!-- 可以简单记作：vc（value和change） -->
     <div id="example-6">
      <select :value="selected2" @change="selected2=$event.target.value">
        <option disabled value="">请选择</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </select>
      </br>
      <span>Selected2: {{ selected2 }}</span>
    </div>
    </br>

    <!-- 选择框 -->
    <!-- 多选时 按住 -->
    <!-- multiple 属性规定可同时选择多个选项。
         在不同操作系统中，选择多个选项的差异：
         对于 windows：按住 Ctrl 按钮来选择多个选项
         对于 Mac：按住 command 按钮来选择多个选项 -->
    <div id="example-7">
      <select multiple v-model="muselected" style="width: 50px;" >
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
      </br>
      <span>multiple Selected: {{ muselected }}</span>
    </div>
    </br>
    <!-- v-model等同于下面 :value和@change，是一个语法糖-->
    <!-- 可以简单记作：vc（value和change） -->
    <div id="example-8">
      <select multiple :value="muselected2" @change="change(muselected2,$event)" style="width: 50px;" >
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
      </select>
      </br>
      <span>multiple Selected2: {{ muselected2 }}</span>
    </div>
  </div>
</template>
<script>
import home from './Home.vue'
export default {
  name: "about",
  data() {
    return {
      username: "",
      username2: "",
      checkedName: "",
      checkedName2: "",
      checkedNames: [],
      checkedNames2: [],
      selected:'',
      selected2:'',
      muselected:[],
      muselected2:[],
    };
  },
  methods: {
    // checked2=$event.target.value
    change(checkedNames2, e) {
      console.log(checkedNames2);
      console.log(e);
      console.log(e.target.value);
      let index = checkedNames2.findIndex((item) => item == e.target.value);
      console.log(index);
      index === -1
        ? checkedNames2.push(e.target.value)
        : checkedNames2.splice(index, 1);
    }
  },
  mounted(){
    console.log("-----------------------------");
    console.log(home);
  }
};
</script>

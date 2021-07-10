<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- 字符串 字符串可以直接用to属性 -->
    <router-link to="/about/child1">child1页面--字符串直接跳转</router-link> </br>

    <!-- 字符串 使用 v-bind 的js表达式 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效-->
    <router-link :to="'/about/child2'">child2页面--v-bind的js表达式-字符串</router-link> </br>

    <!-- path 使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{path :'child3'}">child3页面--v-bind的js表达式-对象(包含path)</router-link> </br>

    <!-- path和query 使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{path :'child4',query:{user:'4'}}">child4页面--v-bind的js表达式-对象(包含path和查询参数query)</router-link> </br>

    <!-- name 使用命名路由  使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{name :'child5'}">child5页面--v-bind的js表达式-对象(包含命名路由)</router-link> </br>

    <!-- name和params 使用命名路由并使用params传参  使用 v-bind 的js对象 可以省略v-bind 记住一定要使用v-bind进行绑定，否则不会生效 -->
    <router-link :to="{name :'child6',params:{user:'6'}}">child6页面--v-bind的js表达式-对象(包含命名路由和params参数)</router-link>

    
    <router-view></router-view>
  </div>
</template>

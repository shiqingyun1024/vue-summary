<template>
  <div class="hello">
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <p>session 说完了，那么出现频率超高的关键字 token 又是什么？

        不妨谷歌搜一下 token 这个词，可以看到冒出来几个（年纪大的人）比较熟悉的图片：密码器。过去网上银行不是只要短信认证就能转账，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是
        token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……
    </p>
    <p>  

        其实本质上 token 的功能就是和 session id 一模一样。你把 session id 说成 session token 也没什么问题（Wikipedia 里就写了这个别名）。

        其中的区别在于，session id 一般存在 cookie 里，自动带上；token 一般是要你主动放在请求中，例如设置请求头的 Authorization 为 bearer。

        然而上面说的都是一般情况，根本没有明确规定！
    </p>  
    <p>  

        剧透一下，下面要讲的 JWT（JSON Web Token）！他是一个 token！但是里面放着 session 信息！放在客户端，并且可以随你选择放在 cookie 或是手动添加在
        Authorization！但是他就叫 token！

        个人觉得你不能通过存放的位置判断是 token 或是 session id，也不能通过内容判断是 token 或是 session 信息，session、session id 以及 token
        都是很意识流的东西，只要你明白他是什么、怎么用就好了，怎么称呼不太重要。
    </p>  
    <p>    

        另外在搜索资料时也看到有些文章说 session 和 token 的区别就是新旧技术的区别，好像有点道理。

        在 session 的 Wikipedia 页面上 HTTP session token 这一栏，举例都是 JSESSIONID (JSP)、PHPSESSID (PHP)、CGISESSID
        (CGI)、ASPSESSIONID (ASP) 等比较传统的技术，就像 SESSIONID 是他们的代名词一般；而在研究现在各种平台的 API 接口和 OAuth2.0 登录时，都是使用 access token
        这样的字眼，这个区别着实有点意思。
    </p>
    <p>  

        理解 session 和 token 的联系之后，可以在哪里能看到“活的” token 呢？

        打开 GitHub 进入设置，找到 Settings / Developer settings，可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub
        API，证明“你就是你”。

        在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登录的朋友应该都能感受到 token 是个什么啦。

        Token 在权限证明上真的很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

        在理解了三个关键字和两种储存方式之后，下面我们正式开始说“用户登录”相关的知识和两种登录规范——JWT 和 OAuth2.0。

        接着你可能会频繁见到 Authentication 和 Authorization 这两个单词，它们都是 Auth
        开头，但可不是一个意思，简单来说前者是验证，后者是授权。在编写登录系统时，要先验证用户身份，设置登录状态，给用户发送 token 就是授权。
    </p>
    <img data-src="static/images/1.jpeg" v-lazyLoad/>
    <img data-src="static/images/2.jpeg" v-lazyLoad/>
    <img src="../images/2.jpeg"/>
    <img src="../images/2.jpeg"/>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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

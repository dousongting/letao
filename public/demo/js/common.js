//禁用圆环 
NProgress.configure({
  showSpinner: false
});


// 关闭进度条 
//引入了nprogress.js文件后，就有了一个全局对象NProgress对象
// //开启进度条
// NProgress.start();
// //关闭进度条
// NProgress.done();
// jquery的全局事件需要给document注册（固定写法)
$(document).ajaxStart(function(){
  console.log(222);
  //开始进度条
  NProgress.start();
})

$(document).ajaxStop(function(){
  //关闭进度条
  setTimeout(function(){
    NProgress.done();
  },500);
})



//当用户在访问其他页面的时候  要发送ajax请求 查看用户是否登陆 
//非登录页要发送一个ajax
//方法: indexOf():  可返回指定的字符串在字符串中出现的位置
// 如果检索的字符串值没有  则返回-1  

if(location.href.indexOf("login.html")=== -1){
  // alert("加加加");
    //等于-1  证明地址中不包含login.html  这个时候就需要发送ajax请求
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    success: function (data) {
      console.log(data);
      //如果 错误 === 400 的时候  直接重定向到登陆页面
      if(data.error === 400){
        location.href = "login.html";
      }
    }
  })
}

//分类管理 显示隐藏
$(".child").prev().on("click",function(){
  $(this).next().slideToggle();
})
//侧边栏的隐藏与显示
$(".icon_menu").on("click",function(){
  // console.log(111);
  //让lt_aside  隐藏  
  $(".lt_aside").toggleClass("now");
  $(".lt_main").toggleClass("now");
})


//退出功能 
$(".icon_logout").on("click",function(){
  //点击显示模态框
  $("#logoutModal").modal("show");
})

//点击确定时候  发送ajax 请求 
$(".btn_logout").on("click",function(){
  // console.log("!11");
  //发送ajax 请求
  $.ajax({
    type:"get",
    url:"/employee/employeeLogout",
    success:function(data){
      // console.log(data);
      if (data.success) {
        //关闭模态框
        // $("#logoutModal").modal("hide");
        //跳转到登录页   
        location.href =" login.html";
      }
    }
  })
})
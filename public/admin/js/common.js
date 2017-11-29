//关闭进度环
//引入 nprogress.js 文件后  就有一个全局对象NProgress 对象
//开启进度条
//NProgress.start();
//关闭进度条
//NProgress.done();
NProgress.configure({
    //关闭圆环
    showSpinner:false
});
//JQ中AJAX的全局事件
// 1. ajaxStart在开始一个ajax请求时触发
$(document).ajaxStart(function(){
    //开始进度条
    NProgress.start();
});
//beforeSend回调函数
// 2. ajaxSend在beforeSend回调函数之后触发


//success回调函数
// 3. ajaxSuccess在success回调函数之后触发


//error
// 4. ajaxError在error回调函数之后触发

//complete
// 5. ajaxComplete在complete回调函数之后触发


// 6. ajaxStop在ajax请求结束时触发
$(document).ajaxStop(function(){
    //结束进度条
    setTimeout(function(){
        NProgress.done();
    },500);
});


//二级菜单显示与隐藏的效果
// prev  上一个兄弟元素
$(".child").prev().on("click",function(){
    console.log(this);
    // this 指向的是child的上一个兄弟元素  next  下一个兄弟元素
    $(this).next().slideToggle();
    //slideToggle:切换动画显示隐藏 
})

//侧边栏显示与隐藏效果
$(".icon-menu").on("click",function(){
    //toggleClass : 切换类
    $(".lt-aside").toggleClass("now");
    $(".lt-main").toggleClass("now");
})

//退出功能
$(".icon-logout").on("click",function(){
    console.log(111);
    $("#logoutModal").modal("show");
    //因为jquery 注册事件不会覆盖
    // off() 解绑所有的事件 
    //off("click")
    $(".btn-logout").off().on("click",function(){
            //发送ajax 请求  告诉服务器 需要退出
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            success: function (data) {
                if (data.success) {
                    //退出成功 才能跳转到登陆页面
                    location.href = "login.html";
                }
            }
        })
     })
})
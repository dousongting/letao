$(function(){
// 发送ajax 请求   获取数据渲染页面
$.ajax({
    type:"get",
    url:"/user/queryUserMessage",
    success:function(data){
        console.log(data);
        //数据对象 和模板引擎结合
        if(data.error === 400){
            //如果失败了就跳转到登陆页面
            location.href='login.html';
        }
        // 成功就渲染页面
        $(".userinfo").html(template("tpl",data));

    }
})























    //给退出按钮注册点击事件 
    //发送ajax  成功 跳转到登陆页面
    $(".btn-logout").on("click",function(){
        // console.log(1);
        $.ajax({
            type:"get",
            url:"/user/logout",
            success:function(data){
                // console.log(data);
                if(data.success){
                    //跳转到登陆页面
                    location.href = "login.html";
                }
            }
        })
    })
})
$(function(){
    //获取参数 发送ajax 请求
    $(".btn-login").on("click",function(){
        //获取表单的参数  
        var username = $("[name='username']").val();
        var password = $("[name='password']").val();
        console.log(username,password);
        //验证
        if(!username){
            mui.toast("请输入用户名");
            return false;
        }
        if(!password){
            mui.toast("请输入密码");
            return false;
        }
        //发送ajax请求
        $.ajax({
            type:"post",
            url: "/user/login",
            data:{
                username :username,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.error === 403){
                    mui.toast(data.message);
                }
                if(data.success){
                    //跳转到那里  进行判断
                    //如果是购物车(其他的需要登陆的页面),跳转到登录页 登陆成功咯 就跳转到原来的页面
                    //如果是直接访问的登录页  跳转到用户中心
                    //如果参数中有retUrl 说明需要回跳  如果没有 默认跳到user.html
                    //可以获取到地址栏的参数
                    var search = location.search;
                    if(search.indexOf("retUrl")=== -1){
                        //证明没有 跳转到用户中心
                        location.href = "user.html";
                    }else{
                        //重置search     为空
                        search = search.replace("?retUrl","");
                        location.href = search;
                    }
                }
            }
        })
    })
})
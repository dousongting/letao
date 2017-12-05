$(function(){
        //发送ajax 请求 获取数据 渲染页面 
        // 获取参数  id
    var id = Tools.getParam("productId");
    console.log(id);
    // 发送ajax 请求 
    $.ajax({
        type:"get",
        url:"/product/queryProductDetail",
        data:{
            id:id
        },
        success:function(data){
            console.log(data);
            // 数据对象 和模板引擎结合 
            $(".mui-scroll").html(template("tpl",data));

            //重新初始化轮播图
            //重新初始化轮播图
            mui(".mui-slider").slider({
                interval: 1000
            })
        //尺码选择
        $(".lt-pro-size span").on("click",function(){
            console.log(11);
            $(this).addClass("now").siblings().removeClass("now");

        })
        //重新初始化数字输入框
        mui(".mui-numbox").numbox();

        }
    });
    //给加入购物车这个按钮 注册点击事件
    $(".btn-add-cart").on("click", function () {
        // console.log("11");
        //获取鞋码  
        var size = $(".lt-pro-size span.now").text();

        //检验 如果 没有选择size  就不可以加入购物车
        if (!size) {
            mui.toast("请选择尺码");
            return false;
        }
        var num = $(".mui-numbox-input").val();

        //发送ajax 请求  
        $.ajax({
            type: "post",
            url: "/cart/addCart",
            data: {
                productId: id,
                size: size,
                num: num
            },
            success: function (data) {
                console.log(data);
                if(data.error === 400){  
                    //说明没有登录， 需要传递一个参数，这个参数指定了回跳的地址。
                    location.href = "login.html?retUrl=" + location.href;
                }
                if(data.success){
                    //如果登陆 就添加成功
                    mui.confirm("添加成功","提示",["去购物车","继续逛逛"],function(e){
                        if(e.index === 0){
                            location.href = "cart.html";
                        }
                    })
                }
            }
        })
    })
})

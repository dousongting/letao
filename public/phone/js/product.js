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
        $(".lt-size span").on("click",function(){
            $(this).addClass("now").siblings().removeClass("now");

        })
        //重新初始化数字输入框
        mui(".mui-numbox").numbox();

        }
    })
})
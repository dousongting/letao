$(function(){
    //发送ajax 请求  获取数据  渲染页面
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        success:function(data){
            console.log(data);
            //数据对象和模板引擎结合 
            $(".lt-category-l ul").html(template("tpl",data));

            //渲染二级分类
            var id = data.rows[0].id;
            renderSecond(id);
        }
    });


    //给所有的一级分类注册点击事件
    $(".lt-category-l ul").on("click","li",function(){
        //点击的当前li 添加now  其他全都移除now 这个类
        $(this).addClass("now").siblings().removeClass("now");
        //获取对应的id   
        var id = $(this).data("id");
        //渲染页面
        renderSecond(id);


        //滚动到0，0点
        //mui('.mui-scroll-wrapper').scroll()获取到页面中所有的滚动容器,如果有多个，会返回一个数组。
        mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0, 0, 500);//100毫秒滚动到顶
    })
    function renderSecond(id){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            success:function(data){
                console.log(data);
                //数据对象和模板引擎结合
                $(".lt-category-r ul").html(template("tpl1",data));
            }
        })
    }
})
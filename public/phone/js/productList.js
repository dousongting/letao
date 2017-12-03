$(function(){

  //1. 获取到地址栏的参数，把key放到input框里面
  //2. 发送ajax请求，获取关键字对应的商品， 结合模版引擎渲染出来
  //3. 点击搜索按钮，再次发送ajax请求，获取关键字对应的商品，结合模版引擎渲染出来。
  //4. 排序功能，点击价格进行排序，多传一个排序的参数，获取到对应的商品，结合模版引擎渲染出来
  
    //封装方法
    //准备好参数 发送ajax 请求 获取到结果后渲染到页面
    function render(){
        //声明一个空的参数对象  用于存储 参数
        var param = {};
        param.page = 1;
        param.pageSize = 100;
        param.proName = $(".search-input").val().trim();
        //考虑排序字段  如果lt-sort下的a有now 类  说明需要排序  如果没有now 这个类 说明不需要排序
        // 如果需要排序 只需要给param 加一个参数即可(price/num),如果不需要排序 不给parm加这个参数即可

        //获取lt-sort 下面的被选中的a  意思就是带有now 这个类的a 
        var $now = $(".lt-sort a.now");
        //如果$now 的长度为1  
        //说明被选中了  需要排序
        if($now.length === 1){
            //获取这个被选中的a 的类型
            var type = $now.data("type");//price  num
            //根据箭头的方向获取排序的值
            //find()方法 找到a 下面所有的span
            // 1 升序  2 降序
            var value = $now.find("span").hasClass("fa-angle-down")?2:1;
            //设置param 的参数
            param[type]= value;
        }
        //发送ajxa 请求之前 开启加载状态
        $(".lt-product").html("<div class='loading'></div>");
        $.ajax({
            type:"get",
            url: "/product/queryProduct",
            data:param,
            success:function(data){
                setTimeout(function(){
                    // console.log(data);
                    //渲染页面
                    $(".lt-product").html(template("tpl", data))
                }, 1000);
            }
        })


    }





    
    //获取地址栏的key  
    //发送ajax 请求 获取id 对应的数据 渲染页面
    var key = Tools.getParam("key");
    // console.log(id);
    //把key 设置给搜索框
    $(".search-input").val(key);
    //发送ajax 请求 
    // $.ajax({
    //     type:"get",
    //     url:"/product/queryProduct",
    //     data:{
    //         proName:key,
    //         page:1,
    //         pageSize:100,
    //     },
    //     success:function(data){
    //         console.log(data);
    //         //模板引擎和数据对象结合
    //         $(".lt-product").html(template("tpl",data))
    //     }

    // })
    render();
    //注册点击事件
    $(".search-btn").on("click",function(){
        //渲染页面
        render();
    });
    //排序 
    //需要给排序的a标签 并且有排序类型的注册点击事件
    $(".lt-sort a[data-type]").on("click",function(){
        // console.log(11);
        //如果当前a 有now  添加now  移除其他a 的now  让所有的箭头都向下
        //如果当前a 有now  改变箭头方向
        var $this = $(this);
        if($this.hasClass("now")){
            //改变箭头的方向
            $this.find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");

        }else{
            $this.addClass("now").siblings().removeClass("now");
            $(".lt-sort span").addClass("fa-angle-down").removeClass("fa-angle-up");
   }
   //重新渲染
   render();
    })
})
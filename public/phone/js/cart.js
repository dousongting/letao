$(function(){

// 下拉更新
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                // height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: true, //可选,默认false.首次加载自动下拉刷新一次
                // contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                // contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                // contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                // callback: pullfresh - function //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                callback:function(){
                        //发送ajax  请求  渲染页面
                        $.ajax({
                            type: "get",
                            url: "/cart/queryCart",
                            success: function (data) {
                                setTimeout(function(){
                                       console.log(data);
                                       if (data.error === 400) {
                                           //说明没有登录
                                           location.href = "login.html?retUrl=" + location.href;
                                       }
                                       //数据和模板引擎结合
                                       $("#OA_task_2").html(template("tpl", {
                                           list: data
                                       }));
                                        //结束刷新
                                       mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                                }, 500);
                               
                                  
                            }
                        })
                }
            }
        }
    });


    //删除功能
    //要给所有的删除按钮注册点击事件 
    //获取当前点击的id   发送ajax 请求
    //最后重新渲染页面
    $("#OA_task_2").on("tap", ".btn_delete", function () {
        console.log("11");
        var id = $(this).data("id");
        mui.confirm("你是否要删除这个件商品","温馨提示",["确定","取消"],function(e){
            if(e.index === 0){
                $.ajax({
                    type: "get",
                    url: "/cart/deleteCart",
                    data: {
                        id: id
                    },
                    success: function (data) {
                        // console.log(data);
                        if (data.success) {
                            //下拉刷新一次
                         mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                })
            }
        })
        
    });
    //修改功能  
    //给所有的修改按钮注册点击事件
    //获取数据 发送ajax 请求  
    //重新渲染页面
    $("#OA_task_2").on("tap",".btn_edit",function(){
        // console.log(111);
        // var $this = $(this);
        // var id = $this.data("id");
        // var num = $this.data("num");
        // var size = $this.data("size");
        // console.log(id,num,size);
         //dataset:原生js获取自定义属性的属性。所有data-开头的属性都会存储到dataset中
        var data = this.dataset;
        // console.log(data);
        //数据和模板引擎结合
        var html = template("tpl2",data);
        // console.log(html);
        //去掉所有的br
        //应该把html中所有的换行\n给去掉
        html = html.replace(/\n/g, "");
        // 模态框
         mui.confirm(html, "编辑商品", ["确定", "取消"], function (e){
             if(e.index === 0){
                 //获取当前的id  
                 var id = data.id;
                 //获取当前带有now 这个类的span 的值
                 var size = $(".lt_edit_size span.now").text();
                 //获取当前num 的数量
                 var num = $(".mui-numbox-input").val();
                 console.log(id,size,num);
                //发送ajax 请求 获取数据 重新渲染页面
                $.ajax({
                    type:"post",
                    url: "/cart/updateCart",
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    success:function(data){
                        console.log(data);
                        if(data.success){
                            //下拉刷新页面
                             mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
                        }
                    }
                })

             }
         });
         //选择尺码 
         $(".lt_edit_size span").on("tap",function(){
             console.log(111);
            //给当前点击的span 添加now的类  去掉其他span的now这个类
            $(this).addClass("now").siblings().removeClass("now");
         });
         //重新渲染numbox
         mui(".mui-numbox").numbox();
         
    });

    //计算总金额
    //给所有的ck注册change 事件
    $("#OA_task_2").on("change", ".ck",function () {
        // console.log("111");
        //声明一个变量total  用于存储计算的总价格
        var total = 0;
        //遍历所有的被选中的ck 复选框
        $(":checked").each(function(i,e){
            //each  方法
        // this 就指向当前的复选框
        //获取价格 和数量
        var price = $(this).data("price");
        var num = $(this).data("num");
        console.log(price,num);
        total += price * num;

        })
        //toFixed(2)  去除小数
        //设置给lt_total 下面的total
        $(".lt_total .total").text(total.toFixed(2));

    })







})
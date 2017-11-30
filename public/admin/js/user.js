$(function(){
    //1. 渲染页面
    //发送ajax 请求获取用户数据 渲染页面
    var page = 1;
    var pageSize = 5;
    function rander(){
        $.ajax ({
            type:"get",
            url: "/user/queryUser",
            // 对象
            data :{
                page : page,
                pageSize : pageSize
            },
            success:function(data){
                console.log(data);
                //数据与模板引擎结合
                //4. 模板与数据进行绑定
                //第一个参数：模版id
                //第二个参数：对象,模版与对象绑定之后，模版可以直接使用对象中的属性。
                var html = template("tpl",data);
                $("tbody").html(html);
                 //渲染分页
                 $("#paginator").bootstrapPaginator({
                    // bootstrapMajorVersion number 2 搭配使用的Bootstrap版本， 
                    bootstrapMajorVersion:3,
                    // totalPages  设置总页数  
                    //总页数 = 总条数 / 一页显示的条数
                    totalPages : Math.ceil(data.total /data.size),
                    //numberOfPages   设置显示的页码数
                    numberOfPages: 5,
                    //currentPage  设置当前页
                    currentPage : page,
                    //onPageClicked   回调函数  
                    //参数1: event 事件
                    //参数2: 原始事件
                    //参数3: type 类型
                    //参数4: 当前页 
                    onPageClicked:function(a,b,c,p){
                        //修改当前 的页码
                        page = p;
                        //重新渲染页面
                        rander();
                    }

                 })
            }
           
        })
    }
    //页面第一次加载就调用
    rander();

    //2  启用禁用功能(委托事件)
    //因为是模板引擎渲染的  所以要使用事件委托
    $("tbody").on("click",".btn",function(){
        //点击显示模态框 
        //方法: modal("show");
        $("#userModal").modal("show");
        // 需要获取到当前点击的id  才能知道点击的是哪一个 
        //我们已经把id 使用自定义属性 存在td 上面了 
        //当前的this 指向的是btn   
        var id = $(this).parent().data("id");
        //获取isDelete  判断isDelete的值是0 还是1
        //是否存在btn-danger 这个类 存在就证明当前显示的是禁用 要显示启用
        var isDelete = $(this).hasClass("btn-danger")? 0: 1;
        $(".btn-sure").on("click",function(){
            //发送ajax 请求
            $.ajax({
                type:"post",
                url: "/user/updateUser",
                data: {
                    id :id,
                    isDelete: isDelete
                },
                success:function(data){
                    // console.log(data);
                    //判断是否成功  
                    //成功要做的事情
                    if(data.success){
                        //关闭模态框
                        $("#userModal").modal("hide");
                        //重新渲染页面
                        rander();
                    }
                }
            })
        })
    })















})
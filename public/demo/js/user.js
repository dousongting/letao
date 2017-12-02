$(function(){
    //发送ajax 请求 获取数据 渲染页面 
    var page =1;
    var pageSize = 5;
    function rander(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:page,
                pageSize:pageSize
            },
            success: function(data){
                // console.log(data);
                //数据对象和模板引擎结合
                $("tbody").html(template("tpl",data));

                //分页渲染
                $("#paginator").bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion:3,
                    //显示当前页
                    currentPage:page,
                    //计算总页数 
                    //总页数 =  总条数 / 一页显示几条
                    totalPages: Math.ceil(data.total/ data.size),
                    //设置控件显示的页码数
                    numberOfPages:5,
                    //onPageClicked   回调函数  
                    // 四个参数  
                     //参数1: event 事件
                //     //参数2: 原始事件
                //     //参数3: type 类型
                //     //参数4: 当前页 
                    onPageClicked:function(a,b,c,p){
                        //修改当前页码
                       page = p;
                        // 重新渲染 页面
                        rander();
                    }
                })
            }
        })

    }
    //页面已加载调用
    rander();

    //点击按钮禁用和启用
    // 给所有的按钮注册点击事件  此事件为事件委托  
    // 因为 我们使用模板引擎渲染   所以要使用事件委托
    $("tbody").on("click",".btn",function(){
        // console.log(111);
        //显示模态框 
        $("#userModal").modal("show");
        //获取点击的id   
        var id = $(this).parent().data("id");
        console.log(id);
        //获取isDelete  判断isDelete的值是0   禁用 还是1 启用
        //是否存在btn-danger 这个类 存在就证明当前显示的是禁用 要显示启用
        var isDelete = $(this).hasClass("btn-danger")?0 :1;
        //点击确定 
        $(".btn_confirm").on("click", function () {
            // console.log(111);
            //发送ajax 请求 
            $.ajax({
                type: "post",
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete: isDelete
                },
                success:function(data){
                    // console.log(data);
                    if (data.success) {
                         //关闭模态框  
                        $("#userModal").modal("hide");
                        //重渲染页面
                        rander();
                    }
                }

            })
        })
    })

  
})
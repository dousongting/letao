$(function(){
    var page = 1;
    var pageSize = 2;
    function rander(){
        //发送ajax请求 获取数据 渲染页面
        $.ajax ({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page :page,
                pageSize:pageSize
            },
            success:function(data){
                console.log(data);
                //数据对象和模板引擎结合
                $("tbody").html(template("tpl",data));


                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages:Math.ceil(data.total/data.size),
                    numberOfpages:5,
                    currentPage:page,
                    onPageClicked:function(a,b,c,p){
                        page = p;
                        //重新渲染页面
                        rander();
                    }
                })
            }

          
        })
    }

    //页面加载调用一次
    rander();

    //点击添加分类的时候 显示模态框
    $(".btn-add").on("click",function(){
        //显示模态框
        $("#secondModal").modal("show");

        //需要发送ajax请求 获取到所有的一级分类 渲染到下拉菜单中
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:1000
            },
            success:function(data){
                console.log(data);
                //模板引擎和数据对象 结合
                $(".dropdown-menu").html(template("tpl2",data));
            }
        })
    })
    //给所有的a 注册点击事件  
    //因为是模板引擎 渲染的 所以要使用事件委托
    $(".dropdown-menu").on("click","a",function(){
        //获取当前a 的文本   设置到dropdown-text 中
        $(".dropdown-text").text($(this).text());
        //获取到id值 设置给categoryId
        $("[name='categoryId']").val($(this).data("id"));
        //让categoryId校验成功
        $form.data("bootstrapValidator").updateStatus("categoryId","VALID");
    })

    //图片上传
    $("#fileupload").fileupload({
        //指定响应的数据格式
        dataType:"json",
        //图片上传完成之后 会执行的一个函数 通过data.result可以获取到结果
        done:function(e,data){
        console.log(data.result.picAddr);
        $(".img_box img").attr("src",data.result.picAddr);
        // 把上传的图片的地址赋值给 brandLogo
        $("[name='brandLogo']").val(data.result.picAddr);
        //手动更新
        //更新字段的状态   
        //VALID : 校验成功
        $form.data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    })



    //表单校验
    var $form = $("form");
    $form.bootstrapValidator({
        //对所有的类型进行校验
        excluded:[],
        feedbackIcons:{
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
        },
        //校验规则
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"请选择一个分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类的名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传一张图片"
                    }
                }
            }
        }
    })

    //给表单注册校验成功事件
    
    $form.on("success.form.bv",function(e){

        // 阻止浏览器默认事件
        e.preventDefault();
        // 发送ajax 请求
        $.ajax({
            type:"post",
            url: "/category/addSecondCategory",
            data:$form.serialize(),
            success:function(data){
                //成功要做的事情
                if(data.success){
                    //关闭模态框
                    $("#secondModal").modal("hide"),
                    //重新渲染第一页
                    page = 1;
                    rander();
                    //重置样式和表单的值
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    //reset 是dom 的方法
                    $(".dropdown-text").text("请选择一个分类");
                    $(".img_box img").attr("src","images/none.png");
                    $("[type='hidden']").val("");
                }
            }
        })
    })







})
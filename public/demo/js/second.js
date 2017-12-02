$(function(){
    var page = 1;
    var pageSize = 2;
    // 发送ajax 请求 获取数据 渲染页面
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page: page,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                //数据对象和模板引擎结合 
                $("tbody").html(template("tpl",data));
                //渲染分页
                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(data.total / data.size),
                    numberOfpages: 5,
                    currentPage: page,
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        //重新渲染页面
                        render();
                    }
                })
            }
        })
    }
    //页面一加载就 调用
    render();




    //点击添加分类 显示模态框
    $(".btn_add").on("click",function(){
        //显示模态框
        $("#secondModal").modal("show");
        //发送ajax 请求 
        // 发送ajax 请求 获取所有的1级分类名称
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page:page,
                pageSize:1000
            },
            success:function(data){
                // console.log(data);
                // 数据对象 和模板引擎结合
                $(".dropdown-menu").html(template("tpl2",data));
            }

        })
    })


    // 给所有的a 注册点击 事件  因为是模板引擎渲染 要用事件委托
    $(".dropdown-menu").on("click","a",function(){
        // console.log(111);
        //获取a 的内容 设置到dropdown-text 内
        $(".dropdown-text").text($(this).text());
        //获取到id  设置给categoryId
        $("[name='categoryId']").val($(this).data("id"));
        //手动更新 表单字段状态
        // updateStatus(field, status, validatorName)
        //让categoryId校验成功
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    })


    //图片上传
    $("#fileupload").fileupload({
        //指定响应的数据格式
        dataType:"json",
        //图片上传完成之后 会执行的一个函数 通过data.result 可以获取到结果
         //e：事件对象
      //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function(e,data){
            console.log(data.result.picAddr);
            //设置到img_box img 的src 上
            $(".img_box img").attr("src",data.result.picAddr);
            //把图片地址 给 brandLogo  
            $("[name='brandLogo']").val(data.result.picAddr);
            //手动更新
            //更新字段的状态   
            //VALID : 校验成功
            $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");

        }
    })

    //校验表单 
    $form = $("form");
    $form.bootstrapValidator({
        //指定所有类型都校验  那么久传入一个空数组
        excluded:[],
        //指定表单校验时候的图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //指定校验字段
        fields:{
            categoryId:{
                validators: {
                    //不能为空
                    notEmpty:{
                        message:"请选择一个一级分类名称"
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: "请输入二级分类名称"
                    }
                }
            },
            brandLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: "请上传一张图片"
                    }
                }
            },
        }
    })

    //校验成功会触发一个成功事件
    $form.on("success.form.bv",function(e){
        //阻止浏览器默认事件 
        e.preventDefault();
        //发送ajax 请求
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            // 序列化 serialize
            data: $form.serialize(),
            success:function(data){
                // console.log(data);   
                // 为什么这里的data 打印不出来 ?
                if(data.success){
                    //关闭模态框
                    $("#secondModal").modal("hide");
                    //重新渲染 第一页面
                    page = 1;
                    render();
                    //重置表单 
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    //所有的隐藏域的 val 为空
                    $("[name='hidden']").val("");
                    //重置图片的地址
                    $(".img_box img").attr("src","images/none.png");
                    // dropdown-text  的内容 重置回来
                    $(".dropdown-text").text("请选择一级分类");
                }
            }
        })
    })

})
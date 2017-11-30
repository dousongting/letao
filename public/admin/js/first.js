$(function(){
    var page = 1;
    var pageSize = 2;
    function rander(){
        //发送ajax 请求获取数据 渲染页面
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page :page,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                //数据对象和模板引擎结合
                $("tbody").html(template("tpl",data));

                //渲染分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    totalPages:Math.ceil(data.total / data.size),
                    numberOfpages:5,
                    currentPage:page,
                    onPageClicked:function(a,b,c,p){
                        page=p;
                        //重新渲染页面
                        rander();
                    }
                })
            }
        })
    }
    //页面加载调用一次
    rander();


    //点击添加分类  显示模态框
    $(".btn-add").on("click",function(){
        //显示模态框
        $("#firstModal").modal("show");
    })

    //表单校验 
    var $form = $("form");
    // bootstrap-validator插件会在表单提交的时候进行校验，
    // 如果校验成功了，表单会继续提交，但是如果校验失败了，就会阻止表单的提交
    $form.bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //指定校验字段
        fields :{
            //检验categoryName 是否为空
            categoryName:{
                //不能为空
                validators:{
                    notEmpty:{
                        message:"请输入一级分类名称"
                    }
                }
            }
        }

    })
    // 会触发success.form.bv事件，
    // 此时会提交表单，这时候，通常我们需要禁止表单的自动提交，
    // 使用ajax进行表单的提交
    $form.on("success.form.bv", function (e) {
        //阻止浏览器默认事件  阻止页面跳转
        e.preventDefault();
        var category = $("[name='categoryName']").val();
        // console.log(category);
        // console.log($form.serialize());
        //发送ajax
        $.ajax({
            type:'post',
            url:"/category/addTopCategory",
            data:{
                categoryName:category
            },
            //方法2 :
            // data:$form.serialize(),
            success:function(data){
                //成功要做的事情
                if(data.success){
                    //关闭模态框
                    $("#firstModal").modal("hide");
                    //重新渲染第一页
                    page = 1;
                    rander();
                    //需要清空表单的样式和值
                    // validator.resetForm();//重置表单，并且会隐藏所有的错误提示和图标
                    $form.data("bootstrapValidator").resetForm();
                    //重置表单的value值
                    $form[0].reset();

                }
            }
        })
    })



})
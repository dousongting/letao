$(function(){
    var page = 1;
    var pageSize = 2;
    function render(){
        //发送ajax 请求 获取数据 渲染页面
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                //模板引擎和数据对象结合
                $("tbody").html(template("tpl",data));
                //渲染分页:
                //渲染分页
                $("#paginator").bootstrapPaginator({
                    // bootstrapMajorVersion number 2 搭配使用的Bootstrap版本， 
                    bootstrapMajorVersion: 3,
                    // totalPages  设置总页数  
                    //总页数 = 总条数 / 一页显示的条数
                    totalPages: Math.ceil(data.total / data.size),
                    //numberOfPages   设置显示的页码数
                    numberOfPages: 5,
                    //currentPage  设置当前页
                    currentPage: page,
                    //onPageClicked   回调函数  
                    //参数1: event 事件
                    //参数2: 原始事件
                    //参数3: type 类型
                    //参数4: 当前页 
                    onPageClicked: function (a, b, c, p) {
                        //修改当前 的页码
                        page = p;
                        //重新渲染页面
                        render();
                    }
                })
            }
        })
    }
    // 页面一加载 就调用
    render();

    //点击添加分类 显示模态框
    $(".btn_add").on("click",function(){
        // console.log(11);
        //显示模态框 
        $("#firstModal").modal("show");
    })
      //表单校验
    $form = $("#form");
    //  JQ  找对象  为什么id 加# 找到的和 不加#找到的是一样的 
    console.log($form[0]);
    $form.bootstrapValidator({
        //检验图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //校验字段
        fields: {
            //校验 对应name 表单的name属性
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: "一级分类名称不能为空"
                    }
                }
            }
        }
    })
    //校验成功会触发一个成功事件
    $form.on('success.form.bv', function (e) {
        var category = $("[name='categoryName']").val();
        // console.log(category);
        //阻止浏览器默认事件  阻止跳转 
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:{
                categoryName:category
            },
            success:function(data){
                // console.log(data);
                if(data.success){
                    //关闭模态框 
                    $("#firstModal").modal("hide");
                    //重新渲染第一页
                    page =1;
                    render();


                    //重置form 的样式 和值
                    // validator.resetForm();
                    //重置表单，并且会隐藏所有的错误提示和图标
                    $form.data("bootstrapValidator").resetForm();
                    // 清空表单的内容 
                    // reset  是dom 的方法 
                    $form[0].reset();
                }
            }
        })
    });
 
})
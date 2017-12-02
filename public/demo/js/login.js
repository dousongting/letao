$(function(){
    //表单校验  
    // bootstrap - validator插件会在表单提交的时候进行校验，
    // 如果校验成功了，表单会继续提交，但是如果校验失败了，就会阻止表单的提交


    //使用表单校验插件
    $(".form-horizontal").bootstrapValidator({
        //指定校验时的图标显示  
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //指定校验的字段   注意  对应的name表单的name 属性
        fields: {
            username: {
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    //长度校验
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度必须在6-12位之间"
                    },
                    callback :{
                        message:"密码错误"
                    }
                }
            }
        }

    });


    //注册表单验证成功要做的事情
    $(".form-horizontal").on("success.form.bv", function (e) {
        // alert("111");
        //阻止浏览器默认事件 
        e.preventDefault();
        //发送ajax 请求
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $(".form-horizontal").serialize(),
            success: function (data) {
                // console.log(data);
                if(data.success){
                    //证明登陆成功
                    //跳转到首页
                    location.href = "index.html";
                }
                if (data.error===1000) {
                    //用户名不存在  
                   //更新字段的状态
                    // BootstrapValidator在用户输入内容的时候，会做校验，
                    // 当调用bootstrap的插件的方法可以手动会改变字段值的状态。
                    // 可以使用updateStatus(field, status, validatorName)方法更新字段的状态
                    // VALID：校验成功的。
                    //把用户名的校验失败
                    //第一个参数：想要修改的字段
                    //第二个参数：改成什么状态  INVALID  VALID
                    //第三个参数： 指定显示的错误信息
                    $(".form-horizontal").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                }
                if(data.error === 1001){
                    $(".form-horizontal").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
            }
        })

    })
})
$(function(){
    var page = 1;
    var pageSize = 2;

    //声明一个空数组 用于存储上传的三张图片的返回的结果  
    var imgs = [];
    function render() {
        //发送ajax请求 获取数据 渲染页面 
        $.ajax({
            type:"get",
            url: "/product/queryProductDetailList",
            data:{
                page:page,
                pageSize:pageSize
            },
            success:function(data){
                // console.log(data);
                //数据对象和模板结合   
                $("tbody").html(template("tpl",data));


                //渲染分页
                //2. 分页操作
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //设定版本
                    currentPage: page, //当前页
                    totalPages: Math.ceil(data.total / data.size), //总页数
                    itemTexts: function (type, page, current) {
                        //type: 如果是具体的页码，类型是page
                        //如果是首页，type：first
                        //上一页：type:prev
                        //下一页:type:next
                        //尾页：last
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            default:
                                return page;
                        }

                    },
                    tooltipTitles: function (type, page, current) {
                        //type: 如果是具体的页码，类型是page
                        //如果是首页，type：first
                        //上一页：type:prev
                        //下一页:type:next
                        //尾页：last
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            default:
                                return "跳转到第" + page + "页";
                        }

                    },
                    useBootstrapTooltip: true,
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render();
                    }
                });


            }
        })
    }
    //页面一加载就调用 
    render();
    //点击添加商品 显示模态框
    $(".btn-add").on("click",function(){
        $("#productModal").modal("show");
        //发送ajax  请求二级分类 渲染到下拉菜单中
        $.ajax({
            type:"get",
            url: "/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(data){
                // console.log(data);
                //数据对象和模板引擎结合
                $(".dropdown-menu").html(template("tpl2",data));
            }
        })
    })
      //点击品牌时，需要修改按钮的内容，还需要修改隐藏域brandId的值
    //给所有的a  注册点击事件  事件委托  然后获取内容  
    $(".dropdown-menu").on("click","a",function(){
        //设置dropdown-text 的文本  
        $(".dropdown-text").text($(this).text());
        $("[name='brandId']").val($(this).data("id"));

        //3. 选择了品牌，需要手动校验成功
        $form.data("bootstrapValidator").updateStatus("brandId", "VALID");

    })

    //表单校验
    //id
    // var $form = $("#form");
    // 标签
    var $form = $("form");
      //表单校验功能
      var $form = $("form");
      $form.bootstrapValidator({
          //所有类型的表单都参与校验
          excluded: [],
          //校验的小图标
          feedbackIcons: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
          },
          //校验规则
          fields: {
              brandId: {
                  validators: {
                      notEmpty: {
                          message: "请选择品牌"
                      }
                  }
              },
              proName: {
                  validators: {
                      notEmpty: {
                          message: "请输入商品名称"
                      }
                  }
              },
              proDesc: {
                  validators: {
                      notEmpty: {
                          message: "请输入商品描述"
                      }
                  }
              },
              num: {
                  validators: {
                      //库存必须是0以上的数字
                      notEmpty: {
                          message: "请输入商品库存"
                      },
                      regexp: {
                          //必须1-9开头，后面可以是0个或者多个数字
                          regexp: /^[1-9]\d*$/,
                          message: "请输入一个不是0开头的库存"
                      }
                  }
              },
              num: {
                  validators: {
                      //库存必须是0以上的数字
                      notEmpty: {
                          message: "请输入商品库存"
                      },
                      regexp: {
                          //必须1-9开头，后面可以是0个或者多个数字
                          regexp: /^[1-9]\d*$/,
                          message: "请输入一个不是0开头的库存"
                      }
                  }
              },
              size: {
                  validators: {
                      //库存必须是0以上的数字
                      notEmpty: {
                          message: "请输入商品尺码"
                      },
                      regexp: {
                          //必须1-9开头，后面可以是0个或者多个数字
                          regexp: /^\d{2}-\d{2}$/,
                          message: "请输入正确的尺码，例如(32-46)"
                      }
                  }
              },
              oldPrice: {
                  validators: {
                      notEmpty: {
                          message: "请输入商品原价"
                      }
                  }
              },
              price: {
                  validators: {
                      notEmpty: {
                          message: "请输入商品价格"
                      }
                  }
              },
              //随便给了一个name属性 没有赋值 然后非空校验
              productLogo: {
                  validators: {
                      notEmpty: {
                          message: "请上传3张图片"
                      }
                  }
              }
          }
      });
    //图片上传  
    $("#fileupload").fileupload({
        //返回值的类型
        dataType:"json",
        done:function(e,data){
            //判断 数组的长度  如果大于等于三  就不允许上传
            if(imgs.length >=3){
                return false;
            }
            //得到一个结果  
            // console.log(data.result);
            //动态的往img_box 添加一张图片
            $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">');
            //把这个返回的结果 push 到数组中  存起来
            imgs.push(data.result);
            // console.log(imgs);
            //判断数组的长度   如果 imgs 的长度等于3  说明上传了3站 那么我们就把把productLogo改成校验成功
            if(imgs.length === 3){
                $form.data("bootstrapValidator").updateStatus("productLogo", "VALID");
            }else{
                  $form.data("bootstrapValidator").updateStatus("productLogo", "INVALID");
            }
        }
    });

    //给表单注册检验成功事件 
    $form.on("success.form.bv",function(e){
        //阻止浏览器默认事件
        e.preventDefault();
        //发送ajax 请求 
        // 拼接参数 
        var param = $form.serialize();
        //因为我们把这个结果存在数组中  所以 通过数组下标我 们可以获取到
        param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
        param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
        param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;
        console.log(param);
        $.ajax({
            type:"post",
            url: "/product/addProduct",
            data:param,
            success:function(data){
                if(data.success){
                    //关闭模态框
                    $("#productModal").modal("hide");
                    //重新渲染第一页 
                    page = 1;
                    render();
                    //重置表单样式
                    $form.data("bootstrapValidator").resetForm();
                    $form[0].reset();
                    $(".dropdown_text").text("请选择品牌");
                    $("[name='brandId']").val("");
                    //移除所有的img_box 里面的img
                    $(".img_box img").remove();
                    //清空数组
                    imgs = [];
                }
            }
        })
    })










})
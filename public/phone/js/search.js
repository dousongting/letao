$(function(){
    //约定好存储历史记录的key:history 以后增删改查都应该使用history
    //无论有没有值 都应该给我返回一个数组
    //如果没有值 那么返回一个空数组
    function getHistory(){
        //1.从localStorage 中获取到history 对应的值  会得到一个字符串类型的数据
        var history = localStorage.getItem("history")||'[]';
        console.log(history); //["阿迪达斯","耐克"]s
        // console.log(typeof (history));//string
        //把字符串转换成一个数组
        // var arr = history.split(",");  //(2) ["["阿迪达斯"", ""耐克"]"]
        var arr = JSON.parse(history);
        // console.log(arr);
        return arr ;
    }
    //渲染功能
    function render(){
        var arr = getHistory();
        //调用getHistory 获取localStorage 中存储的数据
        //数据对象 和模板引擎结合 渲染页面
        $(".lt-history").html(template("tpl",{list:arr}));
    }
    //列表渲染功能 
    //从缓存中获取到数据  并且转换成了数组
    //结合模板引擎 吧数据渲染出来
    render();


    //清空逻辑 
    //注册点击事件
    //把 localStorage 中的history清除
    //重新渲染页面
    $(".lt-history").on("click",".btn_empty",function(){
        //插件  提示框
        mui.confirm("你是否要清空所有的搜索记录?","温馨提示",["否","是"],function(e){
            // console.log(e);
            //如果index 是 1 证明全部都清空  
            if(e.index === 1){
                //全都清空
                localStorage.removeItem("history");
                //重新渲染
                render();
            }
        })
    });
    //删除的逻辑 
    //给x 注册点击事件
    //获取到点击的x 的下标 
    //获取本地缓存 得到数组
    //删除数组张对应下标的那一项
    //重新设置缓存
    //重新渲染
    $(".lt-history").on("click",".btn_delete",function(){
        // console.log("jj");
        var index = $(this).data("index");
        console.log(index);
        mui.confirm("你确定要删除这一条记录吗?","温馨提示",["取消","确定"],function(e){
            // console.log(e);
            if(e.index === 1){
                //证明要删除 
                // 获取到数组 
                var arr = getHistory();
                // console.log(arr);
                //splice   : 拼接  
                //参数1: 起始位置
                //参数2: 删除个数
                //参数3: 替换元素
                arr.splice(index,1);
                // console.log(arr);
                // console.log(JSON.stringify(arr)); //转成字符串
                //重新设置缓存
                localStorage.setItem("history", JSON.stringify(arr));
                //重新渲染页面
                render();

            }
        })
    });


    //添加的逻辑
    //注册点击事件
    //获取到输入的关键字
    //获取本地缓存.得到数组
    //把关键字添加到数组的最前面
    //重新设置缓存
    //重新渲染

    //需求 历史记录不能超过10条
    // 历史记录不能重复  如果重复 放到最前面
    
    $(".search-btn").on("click",function(){
        // console.log(11);
        //获取输入的关键字
        var key = $(".search-input").val().trim();
        //清空搜索框的内容
        $(".search-input").val("");
        // console.log(key);
        
        //插件提示框
        if(key === ""){
            mui.toast("请输入搜索关键字");
            return false;
        }

        //获取本地缓存得到数组
        var arr = getHistory();

        //判断key 在数组中是否存在  如果存在 就删除他  
        var index = arr.indexOf(key);// 获取key 在arr 中的下标 
        //如果是-1  证明是不存在 的  否则就是存在
        if(index != -1){
            //存在  删除
            arr.splice(index, 1);
        }
        //判断数组的长度 
        // 如果数组的长度大于= 10  删除最后一个
        if(arr.length >= 10){
            arr.pop();
        }


        //将关键字添加到数组的最前面
        arr.unshift(key);
        // console.log(arr);
        //重新设置缓存 
        localStorage.setItem("history",JSON.stringify(arr));
        //重新渲染页面
        render();

        //页面跳转到商品列表页面
        location.href = "productList.html?key="+key;

    })


})
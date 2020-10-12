$(function () {
    var layer = layui.layer;

    var form = layui.form;

    var laypage = layui.laypage;
    // 1.声明一个对象,请求数据时需要将数据提交给服务器
    var q = {
        pagenum: 1,  //	页码值
        pagesize: 2,  //  每页显示多少条数据
        cate_id: '',  //  文章分类的 Id
        state: ''   //  文章的状态
    }

    // 定义美化时间过滤器
    template.defaults.imports.meihua = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = buling(dt.getMonth() + 1);
        var d = buling(dt.getDate());
        var h = buling(dt.getHours());
        var f = buling(dt.getMinutes());
        var s = buling(dt.getSeconds());

        return y + '-' + m + '-' + d + '  ' + h + ':' + f + ':' + s

    }

    // 时间美化 之 补零
    function buling(a) {
        return a >= 10 ? a : '0' + a;
    }

    initTable();

    // 2. 获取文章列表数据的方法
    function initTable() {
        // 发起AJAX发起请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                // 判断是否获取列表数据成功
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败!");
                }

                // 若获取成功
                layer.msg("恭喜您! 获取文章列表成功");
                var str = template('tpl-table', res)
                $('tbody').html(str)
                renderPage(res.total);
            }
        })
    }

    initCate();
    // 3. 初始化文章分类
    function initCate() {
        // 发起AJAX请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 判断是否获取到下拉列表数据
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg(res.message)
                // 如果获取成功,则调用模板引擎渲染到页面
                var str = template('tpl-cate', res)
                // console.log(str)
                $('[name="cate_id"]').html(str)
                // 通知 layui 重新渲染下拉菜单
                form.render();
            }
        })
    }

    // 4. 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性值
        q.cate_id = cate_id;
        q.state = state;
        // 根据筛选的条件,重新渲染表格的数据
        initTable();
    })


    // 5.渲染分页
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', // 容器  注意，这里的 test1 是 ID，不用加 # 号
            count: total,  //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示多少条
            curr: q.pagenum,   //默认显示那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 因为每页显示多少条，默认的数据为10、20...跨度太大，可以使用limits 手动修改
            limits: [2, 3, 5, 10],
            // jump 分页的回调，用来做点击页面值后切换分页用的
            jump: function (obj, first) {
                // 打印的是被点击的相应的页码值
                // console.log(obj.curr);
                // 把最新的页码值打印到q的查询参数对像中
                q.pagenum = obj.curr;

                // 把最新获取的每页显示的条目再次赋值给 pagesize 
                q.pagesize = obj.limit
                // 重新渲染页面
                // 若在这里直接调用 initTable() 会出现死循环
                // 为了避免出现死循环 要判断下这是点击出发的 jump 回调，还是调用 laypage.render() 方法时触发的 jump 回调
                // 可以利用 first 的值 ，来判断是那种方式触发的 jump 回调 ，若first的值为 true 那么就是调用 laypage.render() 方法时触发的 jump 回调，否则就是点击时触发的
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 6.删除表格数据
    // 用事件委托绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取对应文章的id
        var Id = $(this).attr('data-id');
        // 发起前询问
        layer.confirm('确定要删除么?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    // console.log(res)
                    // 判断是否删除成功
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您，删除列表成功')
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
        // 发起ajax请求

    })

})
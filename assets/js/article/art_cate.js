$(function () {
    // 1. 初始化文章分类列表
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                var str = template("tpl-table", res)
                $('tbody').html(str);
            }

        })
    }

    // 2. 为添加按钮绑定事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })


    // 3. 添加文章分类
    var indexAdd = null;
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 否则添加数据成功
                initArtCateList();
                layer.msg("恭喜您! 添加文章成功");
                layer.close(indexAdd)

            }
        })
    })

    // 4.修改展示表单
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        // 获取id ,发送ajax获取数据 渲染到页面
        var Id = $(this).attr('data-id');
        // console.log(Id)
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })

        // 5.修改 - 提交
        $("body").on('submit', '#form-edit', function (e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    // 若更新成功则重新渲染页面
                    initArtCateList();
                    layer.msg("恭喜您! 修改数据成功")
                    layer.close(indexEdit)
                }
            })
        })
    })



    // 6.删除
    $('tbody').on('click','.btn-delete', function () {
        var Id = $(this).attr("data-id");
        // console.log(Id)
        // 显示对话框
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    // 重新渲染页面
                    initArtCateList();
                    layer.msg('恭喜你! 删除数据成功')
                    layer.close(index)
                }
            })
          });
    })
})
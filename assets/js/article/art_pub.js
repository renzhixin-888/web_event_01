$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化下拉菜单
    initCate();
    function initCate() {
        // 发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                var str = template('tpl-cate', res)
                $('[name="cate_id"]').html(str);
                form.render();
            }
        })

    }


    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4. 点击按钮上传
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5. 监听表单 coverFile 的change事件
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0];
        if (file == undefined) {
            return layer.msg('请选择文件')
        }
        // 5.2 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // 5.3 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6. 设置状态
    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append('state', state);
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                console.log(...fd)
                //  发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    // 封装添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                layer.msg('恭喜您！跳转页面成功,跳转中。。。')
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 2000)
            }

        })
    }
})
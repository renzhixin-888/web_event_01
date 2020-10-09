$(function () {
    var form = layui.form;
    // 1.定义验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度为1~6之间";
            }
        }
    })

    // 2.初始化用户信息
    initUserInfo();
    // 导出
    var layer = layui.layer;
    // 封装
    function initUserInfo() {
        // 先获取用户信息，再将用户信息填写到表单中
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res)
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 重新获取数据并渲染
        initUserInfo();

    })

    // 4.修改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("恭喜您，修改用户信息");
                // 调用父框架的全局方法
                window.parent.getUserInfo();
            }
        })
    })

})
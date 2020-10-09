$(function () {
    // 1.定义验证规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须在6~12位之间'
        ],

        // 新旧密码不能一致
        samePwd: function (value) {
            // value是新密码的值
            if (value === $('[name="oldPwd"]').val()) {
                return '新密码不能和旧密码相同'
            }
        },
        // 两次输入密码必须一致
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return "两次密码输入不一致"
            }
        }
    })

    // 2.表单提交
    // 2.1 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发送AJAX请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // 判断是否修改成功
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg(res.message)
                // 将jQuery转换为原生JS 并调用reset事件
                $(".layui-form")[0].reset();
                
            }
        })
    })


})
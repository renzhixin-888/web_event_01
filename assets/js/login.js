$(function () {
    // 点击去注册页面
    $("#link_reg").on('click', function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    // 1.点击去登录页面
    $("#link_login").on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })
    // 2.从layui中获取form
    var form = layui.form;
    form.verify({
        // 自定义验证规则
        pwd: [/^[\S]{6,12}$/, '密码必须是6-16位，且不能输入空格'],
        repwd: function (value) {
            var pwd = $('.reg-box input[name = password]').val()
            if (pwd !== value) {
                return "两次输入的密码不一致"
            }
        }
    })

    // 3.注册表单
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        // 1.阻止表单默认提交行为
        e.preventDefault();
        // 2.发起Ajax请求
        $.ajax({
            method: "POST",
            // url: "http://ajax.frontend.itheima.net/api/reguser",
            url:"/api/reguser",
            data: {
                username: $('.reg-box [name="username"]').val(),
                password: $('.reg-box [name="password"]').val()
            },
            success: function (res) {
                // 判断若已将有了该用户名则return
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 否则注册成功
                layer.msg("恭喜您，注册成功")
                // 手动切换登录表单
                $("#link_login").click();
                // 重置form表单
                $("#form_reg")[0].reset();
            }
        })
    })

    // 4.登录
    $("#form_login").submit(function (e) {
        // 1.阻止表单默认提交行为
        e.preventDefault();
        // 2.发起Ajax请求
        $.ajax({
            method: "POST",
            // url: "http://ajax.frontend.itheima.net/api/login",
            url: "/api/login",
            // 快速获取表单中的元素
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                // 判断若已将有了该用户名则return
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 否则注册成功
                layer.msg("恭喜您，登录成功")
                // 保存token，未来的接口都是用token
                localStorage.setItem("token", res.token);
                // 跳转页面
                location.href = "/index.html";
            }
        })
    })
})
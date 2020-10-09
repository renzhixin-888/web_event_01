$(function () {
    getUserInfo();

    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        // 框架提供询问
        layer.confirm('是否确认离开鑫鑫', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储
            localStorage.removeItem('token');
            // 页面跳转
            location.href ='/login.html';
            // 关闭咨询框
            layer.close(index);
        })
    })
});
// getUserInfo();


// 获取用户信息
function getUserInfo() {
    $.ajax({
        method:'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization:localStorage.getItem("token") || ""
        // },
        success: function (res) {
            // console.log(res)
            // 判断是否获取信息成功
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 若成功渲染用户信息
            randerAvatar(res.data);
        },
        // 无论成功还是失败都将触发 complete 方法
        // complete: function (res) {
        //     console.log(res)
        //     // 判断如果身份验证失败，则强制跳转到登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
        //         // 删除本地存储
        //         localStorage.removeItem('token');
        //         // 页面跳转
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户信息
function randerAvatar(user) {
    // 1.渲染用户名称
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);

    // 2.渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        //渲染文本头像
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $('.user-avatar').show().html(first);
    }
}
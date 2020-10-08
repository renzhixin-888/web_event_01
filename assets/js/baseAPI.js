// 1.没次发送ajax请求，或get请求,或post请求都先触发ajaxPrefilter请求
var baseURL = "http://ajax.frontend.itheima.net"
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
    // 2.对需要权限的接口配置头信息
    // 必须是my开头才可
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    // 3.拦截所有响应，判断身份认证信息
    options.complete = function (res) {
        console.log(res)
        // 判断如果身份验证失败，则强制跳转到登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 删除本地存储
            localStorage.removeItem('token');
            // 页面跳转
            location.href = '/login.html'
        }
    }
});
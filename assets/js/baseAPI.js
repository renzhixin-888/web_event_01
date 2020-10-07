// 没次发送ajax请求，或get请求,或post请求都先触发ajaxPrefilter请求
var baseURL = "http://ajax.frontend.itheima.net"
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url;
});
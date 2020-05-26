export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};
//传入时间知道是星期几
//调用方式getWeek(new Date("2019-11-11"))
export function getWeek(datenew) {
    let week;
    let date = new Date(datenew);
    if (date.getDay() == 0) week = "星期日"
    if (date.getDay() == 1) week = "星期一"
    if (date.getDay() == 2) week = "星期二"
    if (date.getDay() == 3) week = "星期三"
    if (date.getDay() == 4) week = "星期四"
    if (date.getDay() == 5) week = "星期五"
    if (date.getDay() == 6) week = "星期六"
    return week;
}
//转换年月日方法
//getDate方法接受两个参数，参数一为需要转换的格式，如yyyy-mm-dd，或yyyy/mm/dd，其他格式可以根据需要自主添加；参数2为时间戳
export function getDate(format, str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSec = oDate.getSeconds();
    let oTime;
    if (format == 'yyyy-mm-dd') {
        //oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSec); //最后拼接时间
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay); //最后拼接时间
    } else if (format == 'yyyy/mm/dd') {
        oTime = oYear + '/' + getzf(oMonth) + '/' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSec); //最后拼接时间
    }
    return oTime;
};
//补0操作  
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
export function getNewDate(date) {
    //获取系统当前时间
    let nowdate = new Date(Date.parse(date));
    let y = nowdate.getFullYear();
    let m = nowdate.getMonth() + 1;
    let d = nowdate.getDate();
    let formatnowdate = y + '-' + m + '-' + d;
    return formatnowdate;
}
export function beforeOneMonth(date) {
    //获取系统当前时间的前两个月的时间
    let nowdate = new Date(Date.parse(date));
    nowdate.setMonth(nowdate.getMonth() - 1);
    let y = nowdate.getFullYear();
    let m = nowdate.getMonth() + 1;
    let d = nowdate.getDate();
    let formatwdatenew = y + '-' + m + '-' + d;
    return formatwdatenew;
}
export function beforeTwoMonth(date) {
    //获取系统当前时间的前两个月的时间
    let nowdate = new Date(Date.parse(date));
    nowdate.setMonth(nowdate.getMonth() - 2);
    let y = nowdate.getFullYear();
    let m = nowdate.getMonth() + 1;
    let d = nowdate.getDate();
    let formatwdatenew = y + '-' + m + '-' + d;
    return formatwdatenew;
}
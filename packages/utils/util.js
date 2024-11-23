import BigNumber from "bignumber.js";
/**
 * @desc 节流
 * @param {number} delay 延迟时间
 * @param {Boolean} noTrailing 是否要清空定时器
 * @param {function} callback 回调函数
 * @param {Boolean} debounceMode debounce模式 / throttle模式
 * @return {function}
 */
export function throttle(delay, noTrailing, callback, debounceMode) {
    let timeoutID;
    let cancelled = false;
    let lastExec = 0;

    function clearExistingTimeout() {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
    }
    function cancel() {
        clearExistingTimeout();
        cancelled = true;
    }
    if (typeof noTrailing !== "boolean") {
        debounceMode = callback;
        callback = noTrailing;
        noTrailing = undefined;
    }
    function wrapper(...arguments_) {
        const self = this;
        const elapsed = Date.now() - lastExec;
        if (cancelled) return;
        function exec() {
            lastExec = Date.now();
            callback.apply(self, arguments_);
        }
        function clear() { timeoutID = undefined }
        if (debounceMode && !timeoutID) { exec(); }
        clearExistingTimeout();
        if (debounceMode === undefined && elapsed > delay) {
            exec();
        } else if (noTrailing !== true) {
            timeoutID = setTimeout(
                debounceMode ? clear : exec,
                debounceMode === undefined ? delay - elapsed : delay
            );
        }
    }
    wrapper.cancel = cancel;
    return wrapper;
}
/**
 * @desc 防抖
 * @param {number} delay 延迟时间
 * @param {Boolean} atBegin 是否立即执行
 * @param {function} callback 回调函数
 * @return {function}
 */
export function debounce(delay, atBegin, callback) {
    return callback === undefined
        ? throttle(delay, atBegin, false)
        : throttle(delay, callback, atBegin !== false);
}
/**
* @func 阿拉伯数字金额转成大写金额
* @param {number} n
* @returns 55.33=>伍拾伍元叁角叁分  11111=>壹万壹仟壹佰壹拾壹元整
*/
export const moneyToChinese = n => {
    if (Number.isNaN(Number(n))) {
        return "";
    }
    const fraction = ["角", "分"];
    const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    const unit = [
        ["元", "万", "亿", "兆"],
        ["", "拾", "佰", "仟"]
    ];
    const head = n < 0 ? "欠" : "";
    n = Math.abs(n);
    const numWithBigNumber = new BigNumber(n);
    let s = "";
    for (let i = 0; i < fraction.length; i++) {
        const decimalNum = numWithBigNumber
            .times(10)
            .times(10 ** i)
            .toNumber();
        s += (digit[Math.floor(decimalNum) % 10] + fraction[i]).replace(/零./, "");
    }
    s = s || "整";
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = "";
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
    }
    return (
        head +
        s
            .replace(/(零.)*零元/, "元")
            .replace(/(零.)+/g, "零")
            .replace(/^整$/, "零元整")
    );
};
/**
 * @desc   判断对象是否为空
 * @param  {Object} obj
 * @return {Boolean}
 */
export function isEmptyObject(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    return Reflect.ownKeys(obj).length === 0;
}
/**
 * @desc 获取浏览器名称
 * @return {String}
 */
export function getExplorer() {
    const ua = window.navigator.userAgent;
    const isExplorer = exp => ua.indexOf(exp) > -1;
    if (isExplorer("MSIE")) return "IE";
    if (isExplorer("Firefox")) return "Firefox";
    if (isExplorer("Chrome")) return "Chrome";
    if (isExplorer("Opera")) return "Opera";
    if (isExplorer("Safari")) return "Safari";
    return null;
}
/**
 * @param { Number, Number } num1, num2
 * @returns { Number }
 * @description 加法函数，用来得到精确的加法结果,javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。
 * 这个函数返回较为精确的加法结果。
 * */
export function accAdd(arg1, arg2) {
    const numA = new BigNumber(arg1);
    const numB = new BigNumber(arg2);
    return numA.plus(numB).toNumber();
}

/**
 * @param { Number, Number } numA, numB
 * @returns { Number }
 * @description 减法
 * */
export function accSub(arg1, arg2) {
    const numA = new BigNumber(arg1);
    const numB = new BigNumber(arg2);
    return numA.minus(numB).toNumber();
}
/**
 * @param { Number, Number } numA, numB
 * @returns { Number }
 * @description 乘法
 * */
export function accMul(arg1, arg2) {
    const numA = new BigNumber(arg1);
    const numB = new BigNumber(arg2);
    return numA.times(numB).toNumber();
}
/**
 * @func 除法函数,accDiv(10,2)=5
 * @param {*} arg1 被除数
 * @param {*} arg2 除数
 * @returns
 */
export const accDiv = (arg1, arg2) => {
    const numA = new BigNumber(arg1);
    const numB = new BigNumber(arg2);
    return numA.div(numB).toNumber();
};
/**
 * number.toFixed保留小数点
 * @param {*} value 值
 * @param {*} count 保留几位小数
 */
export function toFixed(value, count = 2) {
    const number = +value;
    if (Number.isNaN(value) || Number.isNaN(number)) {
        return "";
    }
    if (number % 1 === 0) {
        return `${number}.${Array(count)
            .fill(0)
            .join("")}`;
    }
    return round(number, count);
}
/**
 * 替代toFixed银行家舍入
 * 用Math.round强制执行四舍五入
 * @param {*} number
 * @param {*} precision
 */
function formatnumber(value, num) {
    let a;
    let i;
    a = value.toString();
    const b = a.indexOf(".");
    const c = a.length;
    if (num === 0) {
        if (b !== -1) {
            a = a.substring(0, b);
        }
    } else if (b === -1) {
        a = `${a}.`;
        for (i = 1; i <= num; i += 1) {
            a += "0";
        }
    } else {
        a = a.substring(0, b + num + 1);
        for (i = c; i <= b + num; i += 1) {
            a = `${a}0`;
        }
    }
    return a;
}
function round(num, precision = 2) {
    // 将科学技术化转换为数字
    const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const number = num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
    return formatnumber(
        Math.round(`${number}e${precision}`) / 10 ** precision,
        precision
    );
}
/**
 * @param {Number} num
 * @return {String}
 * @description 数字类型转千分位字符串
 */
export function numToThs(num = "") {
    const numArray = num.toString().split(".");
    return `${numArray[0].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")}${numArray[1] ? `.${numArray[1]}` : ""
        }`;
}
function isObject(obj) {
    // 判断类型
    return obj !== null && typeof obj === "object";
}
/**
* @param {Object | Array} obj
* @return {Object | Array}  
* @description 递归实现深拷贝 (为了解决循环引用和相同引用、不同类型的深拷贝)
*/
export function deepClone(obj) {
    let visitedObjs = [];
    /**通过闭包维护一个变量，变量中储存已经遍历过的对象
     *每次递归时判断当前的参数是否已经存在于变量中，如果已经存在，就说明已经递归过该变量，就可以停止这次递归并返回上次递归该变量时的返回值
     */
    function baseClone(target) {
        if (!isObject(target)) return target;
        for (let i = 0; i < visitedObjs.length; i++) {
            if (visitedObjs[i].target === target) {
                return visitedObjs[i].result;
            }
        }
        let result = Array.isArray(target) ? [] : {};
        visitedObjs.push({ target, result });
        const keys = Object.keys(target);
        for (let i = 0, len = keys.length; i < len; i++) {
            result[keys[i]] = baseClone(target[keys[i]]);
        }
        return result;
    }
    return baseClone(obj);
}
/**
 * @param {Array} arr
 * @return {Array}
 * @description 利用ES6 Set去重
 */
export function uniqueArr(arr) {
    if (!Array.isArray(arr)) {
        console.log('请传入数组')
        return
    }
    return Array.from(new Set(arr))
};

/**
 * @param {Array} arr
 * @return {Array}
 * @description 根据对象的属性不同去重
 */
export function repeatArr({ data, key }) {
    if (!Array.isArray(data)) {
        console.log('请传入数组')
        return
    }
    let arr = [], obj = {}
    data.forEach((item, index) => {
        let attr = key ? item[key] : item
        if (!obj[attr]) {
            obj[attr] = index + 1
            arr.push(item)
        }
    })
    return arr
};
/**
 * @param {Object} data
 * @return {Object}
 * @description 去除对象中为空的属性
 */
export function objHasValue(data) {
    for (var key in data) {
        if (data[key] === "" || data[key] === undefined) {
            delete data[key];
        }
    }
    return data;
}
/**
 * @param {} 
 * @return {String} uuid
 * @description 前端生成 uuid
 */
export function getUuid() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();  //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
/**
 * @param {String} img 图片地址url 
 * @return {String} base64
 * @description 图片地址转 base64
 */
export function getBase64(img) {
    //传入图片路径，返回base64，使用getBase64(url).then(function(base64){},function(err){});
    let getBase64Image = function (img, width, height) {
        //width、height调用时传入具体像素值，控制大小,不传则默认图像大小
        let canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let dataURL = canvas.toDataURL();
        return dataURL;
    };
    let image = new Image();
    image.crossOrigin = "";
    image.src = img;
    let deferred = $.Deferred();
    if (img) {
        image.onload = function () {
            deferred.resolve(getBase64Image(image));
        };
        return deferred.promise();
    }
};
/**
 * @param {String} strValue 
 * @return {String} 汉字
 * @description 提取汉字
 */
export function GetChinese(strValue) {
    if (strValue !== null && strValue !== "") {
        const reg = /[\u4e00-\u9fa5]/g;
        return strValue.match(reg).join("");
    }
    return "";
}
/**
* @param {String} strValue 
* @return {String} 英文
* @description 提取英文
*/
export function GetaZ(str) {
    if (str !== null && str !== "") {
        const reg = /[a-zA-Z]/g;
        return str.match(reg).join("");
    }
    return "";
}
/**
* @param {String} URL 
* @return {Boolean} 
* @description 检验url是否有效
*/
export function getUrlState(URL) {
    var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
    xmlhttp.Open("GET", URL, false);
    try {
        xmlhttp.Send();
    } catch (e) {
    } finally {
        var result = xmlhttp.responseText;
        if (result) {
            if (xmlhttp.Status == 200) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
/**
* @param {}  
* @return {String}  name
* @description 获取浏览器类型
*/
export function getBrowserType() {
    let str = window.navigator.userAgent;
    let name;
    if (str.indexOf("Opera") > -1 || str.indexOf("OPR") > -1) {
        name = "Opera";
        return name;
    }
    if (str.indexOf("Edge") > -1) {
        name = "Edge";
        return name;
    }
    if (str.indexOf("Firefox") > -1) {
        name = "Firefox";
        return name;
    }
    if (str.indexOf("Chrome") > -1 && str.indexOf("Safari") > -1) {
        name = "Chrome";
        return name;
    }
    if (str.indexOf("Chrome") === -1 && str.indexOf("Safari") > -1) {
        name = "Safari";
        return name;
    }
    if (
        (str.indexOf("Opera") === -1 && str.indexOf("MSIE") > -1) ||
        str.indexOf("Trident") > -1
    ) {
        name = "IE";
        return name;
    }
}





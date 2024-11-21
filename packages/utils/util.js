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

import { ElMessage } from 'element-plus'

/**
 * @desc 保存文件
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}

/**
 * 下载文件
 * 调用方式一：
 * @param {String} url 接口地址  '/api/mall/saleitem/export'
 * @param {Object} data  'post' 传参
 * @param {Object} params 'get' 传参
 * @param {String} method 请求方式  'post'  'get'(默认是get)
 * @param {String} fileName 文件名称
 * 调用方式二:
 * @param {Object} url 对象， 参数 url, method, data, params, timeout, fileName 格式同方式一
 */
// export function exportFile(url, method, data = {}, params = {}, timeout) {
//     /**
//      * 兼容原有方法
//      */
//     let args = {};
//     if (typeof url === "string") {
//         args = {
//             url,
//             method,
//             data,
//             params,
//             timeout
//         };
//     } else if (typeof url === "object") {
//         args = {
//             ...url,
//             url: url.url,
//             method: url.method,
//             data: url.data || {},
//             params: url.params || {},
//             timeout: url.timeout,
//             fileName: url.fileName
//         };
//     }
//     return new Promise((resolve, reject) => {
//         axios({
//             method: args.method || "get",
//             url: args.url,
//             data: args.data,
//             params: args.params,
//             timeout: args.timeout || 15000,
//             responseType: "blob",
//             transformRequest: [
//                 inCome => {
//                     let ret = "";
//                     Object.keys(inCome).forEach(it => {
//                         ret += `${encodeURIComponent(it)}=${encodeURIComponent(
//                             inCome[it]
//                         )}&`;
//                     });
//                     return ret;
//                 }
//             ],
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             },
//             ...args
//         })
//             // eslint-disable-next-line consistent-return
//             .then(res => {
//                 resolve(res);
//                 if (res.data.type.split(";")[0] === "text/plain") {
//                     const reader = new FileReader();
//                     reader.readAsText(res.data);
//                     reader.onload = () => {
//                         console.log(JSON.parse(reader.result).mess);
//                     };
//                     return null;
//                 }
//                 if (!args.fileName) {
//                     // 获取headers中的filename文件名
//                     const tempName = res.headers["content-disposition"]
//                         .split(";")[1]
//                         .split("filename=")[1];
//                     args.fileName = decodeURI(tempName);
//                 }
//                 // ie edge浏览器
//                 if ("msSaveOrOpenBlob" in navigator) {
//                     window.navigator.msSaveOrOpenBlob(res.data, args.fileName);
//                     // eslint-disable-next-line consistent-return
//                     return;
//                 }
//                 if ("download" in document.createElement("a")) {
//                     // 不是IE浏览器
//                     const blobPath = window.URL.createObjectURL(res.data); // 二进制对象转换成url地址
//                     const link = document.createElement("a");
//                     link.style.display = "none";
//                     link.href = blobPath;
//                     link.setAttribute("download", args.fileName);
//                     document.body.appendChild(link);
//                     link.click();
//                     document.body.removeChild(link); // 下载完成移除元素
//                     return window.URL.revokeObjectURL(blobPath); // 释放掉blob对象
//                 }
//             })
//             .catch(error => {
//                 reject(error);
//             });
//     });
// }

/**
 * @desc 处理导出接口数据
 * @param {String || Number} res  webapi返回的数据
 * @return {Blob} blob 对象
 */
export function getExportResponse(res, msgField = 'msg', type = []) {
    const BLOBFILE_TYPE = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msexcel',
        'application/ms-excel',
        ...type
    ];
    const resData = res.data;
    if (BLOBFILE_TYPE.includes(resData.type)) {
        return new Blob([res.data]);
    }
    const reader = new FileReader();
    reader.onload = () => {
        const res = JSON.parse(reader?.result || '');
        ElMessage({
            message: res[msgField] || '操作失败',
            type: 'error',
            plain: true,
        })
    };
    reader.readAsText(res.data);
    return null;
}
/**
 * @desc 格式化文件单位
 * @param {String || Number} size  文件大小(kb)
 * @return {String}
 */
export function formatFileSize(size) {
    let i;
    const unit = ["B", "KB", "MB", "GB", "TB", "PB"];
    let newSize = size;
    for (i = 0; i < unit.length && newSize >= 1024; i += 1) {
        newSize /= 1024;
    }
    return (Math.round(newSize * 100) / 100 || 0) + unit[i];
}
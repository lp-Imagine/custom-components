/**
 * @desc 判断元素是否有某个class
 * @param {HTMLElement} ele
 * @param {String} cls
 * @return {Boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}

/**
 * @desc   为元素添加class
 * @param  {HTMLElement} ele
 * @param  {String} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    const myEle = ele;
    myEle.className += ` ${cls}`;
  }
}

/**
 * @desc 为元素移除class
 * @param {HTMLElement} ele
 * @param {String} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
    const myEle = ele;
    myEle.className = ele.className.replace(reg, ' ');
  }
}

/**
 * @desc 为元素切换class
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(ele, cls) {
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  } else {
    addClass(ele, cls);
  }
}

/**
 * @desc  获取一个元素的距离文档(document)的位置，类似jQ中的offset()
 * @param {HTMLElement} ele
 * @returns { {left: number, top: number} }
 */
export function offset(ele) {
  const pos = {
    left: 0,
    top: 0,
  };
  let myEle = ele;
  while (myEle) {
    pos.left += myEle.offsetLeft;
    pos.top += myEle.offsetTop;
    myEle = myEle.offsetParent;
  }
  return pos;
}
/**
 * @desc 监听dom变化
 * @param {HTMLElement} target 需要观察变动的节点
 * @param {Object} config 观察器的配置（需要观察什么变动）
 * @param {Function} callback 当观察到变动时执行的回调函数
 * @returns {Object} MutationObserver 实例
 */
export function observe(target, config, callback) {
  const observer = new MutationObserver(((mutations, observerOps) => {
    callback(mutations, observerOps);
  }));
  observer.observe(target, config);
  return observer;
}
/**
 * @desc 计算表格可显示的最大高度
 * @param {HTMLElement} table
 * @param {Object} calParam 
 * @return {Number | String} height 可显示的最大高度
 */
export function getComputedHeight(table, calParam) {
  try {
    const tablePos = offset(table.$el); // 表格距离顶部高度
    const bodyH = document.documentElement.clientHeight;
    let height = bodyH - tablePos.top - 30; // 30px预留空间
    const { className, height: extraHeight } = calParam || {};
    // 减去额外的class元素高度
    if (className) {
      const totalInfo = document.querySelector(`.${className}`);
      if (totalInfo) {
        height -= totalInfo.clientHeight;
      }
    }
    // 减去传入的固定高度
    if (extraHeight) {
      height -= extraHeight;
    }
    // 设置最小高度
    return Math.max(height, 150);
  } catch (err) {
    console.error('计算表格高度出错:', err);
    return '';
  }
};
const video = document.getElementById('myVideo');
const resetBtn = document.getElementById('resetBtn');
const statusEl = document.getElementById('status');

//节流:在单位时间内只允许函数执行一次​​

// 1. 尝试从本地存储加载上次播放位置
const savedTime = localStorage.getItem('videoCurrentTime');
if (savedTime) {
    statusEl.textContent = `检测到上次播放位置：${parseFloat(savedTime).toFixed(1)}秒`;
}

// 2. 视频元数据加载完成后设置播放位置
video.addEventListener('loadedmetadata', function () {
    if (savedTime) {
        video.currentTime = parseFloat(savedTime);
        statusEl.textContent += ` | 已恢复进度`;
    }
});

const func = function () {
    localStorage.setItem('videoCurrentTime', this.currentTime);
    console.log('保存');
}
function throttle(func, wait = 0) {
    let timeId = null
    return function (...args) {
        if (timeId) return
        let _this = this
        timeId = setTimeout(() => {
            func.call(_this, ...args)
            timeId = null
        }, wait);
    }
}

const throttleFn = throttle(func, 3000)
// 3. 实时保存播放进度（使用节流优化）
video.addEventListener('timeupdate', throttleFn);

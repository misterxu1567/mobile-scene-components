export default {
    // base64转blob
    convertBase64UrlToBlob(urlData) {
        let arr = urlData.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },
    // 浏览器类型判断及版本
    judgeBrowser() {
        // 获取IE浏览器版本
        function getIeVersion() {
            let IEMode = document.documentMode;
            let rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
            let ma = navigator.userAgent.toLowerCase();
            let match = rMsie.exec(ma);
            try {
                return match[2];
            } catch (e) {
                return IEMode;
            }
        }
        let system = {};
        let ua = navigator.userAgent.toLowerCase();
        if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
            system.browser = 'IE'
            system.version = getIeVersion()
        } else if (ua.indexOf('ubrowser') > -1) {
            system.browser = 'uc';
            system.version = '';
        } else {
            let re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
            let m = ua.match(re);
            system.browser = m[1].replace(/version/, "safari");
            system.version = m[2];
        }
        return system;
    },
    // 秒(s) ＝> 00:00
    transformTime(time) {
        let timeRx = x => {
            let timeRx = new RegExp(/^[0-9]$/g);
            if (timeRx.test(x)) {
                return "0" + x;
            } else {
                return x;
            }
        };
        let _time = time;
        let hour = parseInt(_time / 3600); //时
        let minutes = parseInt((_time % 3600) / 60); //分
        let second = parseInt((_time % 3600) % 60); //秒
        let timeStr = hour + ":" + timeRx(minutes) + ":" + timeRx(second);
        if (hour == 0) {
            timeStr = timeRx(minutes) + ":" + timeRx(second);
        }
        return timeStr;
    }
};
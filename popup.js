function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

sendMessageToContentScript({cmd: 'test', value: 'test'}, function (res) {
    let videoType = res['lists'];
    let title = res['title'];
    if (videoType == null) {
        return;
    }

    function copyItem(str) {
        let oInput = document.createElement('input');
        oInput.value = str;
        document.body.appendChild(oInput);
        oInput.select();
        document.execCommand('Copy');
        oInput.style.display = 'none';
    }

    let boxEl = document.getElementsByTagName('ul')[0]
    let videoStr = '';
    videoType.forEach((item) => {
        videoStr += `<li class="copy"> 
            <label>清晰度：<span>${item.quality}p</span></label>
            <button class="button copy_link">复制链接</button>
        </li>`
    });
    boxEl.innerHTML = videoStr;
    document.getElementById('title').innerHTML = '<button class="button copy_title">复制标题</button>'
    document.getElementsByClassName('copy_title')[0].onclick = () => {
        copyItem(title)
    }
    document.querySelectorAll('.copy').forEach((li, index) => {
        li.getElementsByClassName('copy_link')[0].onclick = () => {
            copyItem(videoType[index]['videoUrl'])
        }
    })
});

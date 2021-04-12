(async function () {

    function sendVideoMsg(videoType, title) {
        let res = {
            'lists': videoType,
            'title': title + '.mp4',
        }
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.cmd == 'test') {
                sendResponse(res);
            }
        });
    }

    const Func = async () => {
        return new Promise((resolve, reject) => {
            // let a = document.querySelector("#player >script:nth-child(1)").innerHTML
            let a = document.querySelector("#player >script:nth-child(2)")
            if (!a) {
                a = document.querySelector("#player >script:nth-child(1)")
            }
            a = a.innerHTML
            a = `	let playerObjList = {};\n${a}`
            let c = a.match("flashvars_[0-9]{1,}")[0]
            // console.log('from local a', a)
            // console.log('from local c', c)
            eval(a)
            let d = eval(c)
            // console.log('from local d', d)
            resolve(d)
        })
    }

    let res = await Func();
    let itemInfo = res['mediaDefinitions'].find((itemInfo) => {
        if (itemInfo['format'] === 'mp4') {
            return itemInfo;
        }
    })
    let title = res['video_title'] || 'no_title';
    if (itemInfo === undefined || !itemInfo.hasOwnProperty('videoUrl')) {
        sendVideoMsg([], title)
    }
    let response = await fetch(itemInfo['videoUrl']);
    let lists = await response.json();
    if (lists.length) {
        lists = lists.reverse()
        sendVideoMsg(lists, title)
    } else {
        sendVideoMsg([], title)
    }
})();

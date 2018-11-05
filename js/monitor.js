function monitor(){
    var sysMsg = $(".system-msg").find(".link");
    if (sysMsg.length > 0){
        var urlList = [];

        for (var i = 0; i < sysMsg.length; i++){
            var u = sysMsg.eq(i).attr("href");
            console.log("u: ", u);
            var r = u.match(/https?:\/\/live.bilibili.com\/\d+/);
            if (r && !urlList.includes(r[0])){
                urlList.push(r[0]);
            }
        }
        console.log("prize room: ", urlList);
        $(".icon-clear").trigger("click");
        for (var i = 0; i < urlList.length; i++){
            chrome.extension.sendRequest({prize_url: urlList[i]});
        }
    }
}
function triggerLotteryBox(cnt){
    $(".lottery-box").trigger("click");
    if (cnt > 0){
        setTimeout(function(){
            triggerLotteryBox(cnt - 1);
        }, 200);
    }else{
        window.close();
    }
}
function accept_prize(req_times){
    req_times = req_times || 0;
    var prizeBox = $(".lottery-box");
    if (prizeBox.length <= 0){
        if(req_times < 20){
            setTimeout(function(){accept_prize(req_times + 1)}, 200);
        }else{
            window.close();
        }
        return ;
    }

    var title = $(".lottery-box .title").html() || "";
    var prizeCount = parseInt(title.split("剩余")[1]) || 0;
    triggerLotteryBox(prizeCount + 3);
}
$(function(){
    var url = window.location.href;
    if (url == "https://live.bilibili.com/357983"){
        console.log("Matched");
        $("#sidebar-vm").remove();
        $("<div>", {
            style: "width: 100%;height: 60px;display: block;position: fixed;background: #616161;top: 0;left: 0;z-index: 9999;text-align: center;line-height: 60px;vertical-align: middle;font-size: 25px;color: #fff;opacity: 0.5;pointer-events: none;",
            html: "持续监控中...",
        }).appendTo("body");

        $(".icon-clear").trigger("click");
        setInterval(monitor, 1000);
    }else if (url.indexOf("https://live.bilibili.com/") > -1){
        console.log("Try accept prize.");
        accept_prize();
    }
});

function monitor(){
    var sysMsg = $(".system-msg").find(".link");
    if (sysMsg.length > 0){
        for (var i = 0; i < sysMsg.length; i++){
            var r = sysMsg.eq(i).attr("href");
            console.log("prize room: ", r);
            chrome.extension.sendRequest({prize_url: r});
        }
        $(".icon-clear").trigger("click");
    }
}
function accept_prize(req_times){
    req_times = req_times || 0;
    if (req_times > 20) {
        window.close();
        return;
    }

    var prizeBox = $(".lottery-box");
    if (prizeBox.length <= 0){
        setTimeout(function(){accept_prize(req_times + 1)}, 200);
        return ;
    }

    var title = $(".lottery-box .title").html() || "";
    var thankName = $(".thx-name").eq(0).html() || "";
    var prizeCount = parseInt(title.split("剩余")[1]) || 0;
    for (var i = 0; i < prizeCount + 5; i++){
        setInterval(function(){$(".lottery-box").trigger("click")}, 200);
    }
    var prizeType = title.split("抽奖")[0] || "";
    try{
        var ac_user = $(".user-panel-ctnr").find("a").eq(0).attr("href").match(/\d+/)[0];
    }catch(e){
        var ac_user = 0;
    }
    var prize_rec_info = {
        ac_user: ac_user,
        url: window.location.href,
        title: title,
        count: prizeCount,
        provider: thankName,
        type: prizeType,
    }
    chrome.extension.sendRequest({prize_rec_info: prize_rec_info});
    setTimeout(function(){window.close();}, 2500);
}
$(function(){
    var url = window.location.href;
    if (url == "https://live.bilibili.com/3"){
        console.log("Matched");
        $("#sidebar-vm").remove();
        $(".icon-clear").trigger("click");
        setInterval(monitor, 1000);
    }else if (url.indexOf("https://live.bilibili.com/") > -1){
        console.log("Try accept prize.");
        accept_prize();
    }
});

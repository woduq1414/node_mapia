let gameData;

function setJob(member, jobName){
    let temp = $($(`[member-data=${member}`)) 
    temp.find('.jobCard').removeClass().addClass(`jobCard ${jobName}Card`)
    temp.removeClass().addClass(`memberNoteBox ${mafiaTeam.includes(jobName) ? "mafiaNoteBox": "citizenNoteBox"}`)
}

function refreshGame(){
    let data = gameData;
    if (info[currentRoom].isPlaying) {
        let member = data.members;
        let string = '';
        
        for (let i in member) {
            if (data.alive.includes(member[i])) {
                //살아씅ㄹ때
            } else {
                //죽었을때
            }
            let temp = $(`[member-data=${member[i]}]`)

            let myJob;
            if(member[i] == currentName){
                myJob = currentJob;
            }

            if(temp.length){
                string += `
                <div class="${temp.attr('class')}" member-data="${member[i]}">
                    <div class="memberNoteBoxWrap">
                        <div id="${member[i]}" class="${temp.find('.jobCard').attr('class')}"></div>
                        <div class="memberNoteBoxNameWrap">
                            <div class="memberNoteBoxName goldClass">${member[i]}</div>
                        </div>
                    </div>
                </div>
                `
            }else{
                string += `
                <div class="memberNoteBox ${myJob ? mafiaTeam.includes(myJob) ? "mafiaNoteBox": "citizenNoteBox" : ""}" member-data="${member[i]}">
                    <div class="memberNoteBoxWrap">
                        <div id="${member[i]}" class="jobCard ${myJob ? myJob : "Question"}Card"></div>
                        <div class="memberNoteBoxNameWrap">
                            <div class="memberNoteBoxName goldClass">${member[i]}</div>
                        </div>
                    </div>
                </div>
                `
            }
            
            
            // 
        }
        $('#notePanel').html(string);


        let cardId = $("#noteTooltipWrap").attr('class')
        console.log(cardId  )
        if(!info[currentRoom].members.includes(cardId)){
            $("#noteTooltipWrap").removeClass();
            $(".hideCard").removeClass("hideCard");
            $("#noteTooltipWrap").fadeOut(150);
        }else{
            $("#noteTooltipWrap").removeClass();
            $(".hideCard").removeClass("hideCard");



            var positionX = Math.abs($(`.jobCard#${cardId}`).width() + 15);
            var positionY = Math.abs($(`.jobCard#${cardId}`).parent().parent().offset().top + (($(`.jobCard#${cardId}`).parent().parent().height() - $("#noteTooltipWrap").innerHeight())/2));
            $("#noteTooltipWrap").addClass(cardId);
            $("#"+cardId).addClass("hideCard");

            console.log(cardId, positionX, positionY)
            
            $("#noteTooltipWrap").removeClass().addClass(cardId);
            
            $("#noteTooltipWrap").css({left : positionX + "px", top : positionY + "px"}).fadeIn(250);
        }

    }


}

currentJob = ''



let mafiaTeam = ["mafia"]


$(document).on("click", ".jobCard", function(){
    var cardId = $(this).attr("id");
    var timeIn = 250;
    var timeOut = 150;
    
    let temp = $(this).attr('class').split(' ');
    let beforeSelected;
    for(i in temp){
        if(temp[i] != "jobCard" && temp[i] != "hideCard"){
            beforeSelected = temp[i].replace("Card", "");
        }
    }
    console.log(beforeSelected);

    let type;
    if($("#noteTooltipWrap").css("display") == "none"){
        type = 1;
        var positionX = Math.abs($(this).width() + 15);
        var positionY = Math.abs($(this).parent().parent().offset().top + (($(this).parent().parent().height() - $("#noteTooltipWrap").innerHeight())/2));
        $("#noteTooltipWrap").addClass(cardId);
        $("#"+cardId).addClass("hideCard");

        
        $("#noteTooltipWrap").removeClass().addClass(cardId);
        $("#noteTooltipName").text(cardId);
        
        $("#noteTooltipWrap").css({left : positionX + "px", top : positionY + "px"}).fadeIn(timeIn);
    }else{
        type = 2;
        console.log($('.selectedNoteTooltip').attr('job'))

        let selectedJob = $('.selectedNoteTooltip').attr('job')

        

        if($("#noteTooltipWrap").attr("class") == cardId){
            $("#noteTooltipWrap").removeClass();
            $("#"+cardId).removeClass("hideCard");
            $("#noteTooltipWrap").fadeOut(timeOut);
            if(selectedJob){
                $(this).removeClass().addClass(`jobCard ${selectedJob}Card`)
                if(mafiaTeam.includes(selectedJob.toLowerCase())){
                    $(this).parents('.memberNoteBox').addClass('mafiaNoteBox').removeClass('citizenNoteBox')
                }else{
                    $(this).parents('.memberNoteBox').addClass('citizenNoteBox').removeClass('mafiaNoteBox')
                }
                

            }
            
            
        }else{
            var positionX = Math.abs($(this).width() + 15);
            var positionY = Math.abs($(this).parent().parent().offset().top + (($(this).parent().parent().height() - $("#noteTooltipWrap").innerHeight())/2));
            if(selectedJob){
                $('.hideCard').removeClass().addClass(`jobCard ${selectedJob}Card`)
                if(mafiaTeam.includes(selectedJob)){
                    $('.hideCard').parents('.memberNoteBox').addClass('mafiaNoteBox').removeClass('citizenNoteBox')
                }else{
                    $('.hideCard').parents('.memberNoteBox').addClass('citizenNoteBox').removeClass('mafiaNoteBox')
                }
            }

            $(".jobCard").removeClass("hideCard");
            $(this).addClass("hideCard");
            $("#noteTooltipWrap").fadeOut(timeOut, function(){
                $("#noteTooltipWrap").removeClass();
                $("#noteTooltipWrap").addClass(cardId);
                $("#noteTooltipWrap").css({left : positionX + "px", top : positionY + "px"}).fadeIn(timeIn);
            });
        }
        
    }

    if(type == 2){
       return;

    }



    let temp2 = $(`.noteTooltip${beforeSelected}`);
    $(".selectedNoteTooltip").removeClass(function (index, className) {
        let temp = className.match(/(select)\w+/g);
        if(temp){
            return temp.join(' ');
        }
        return '';
    });
    if(beforeSelected){
        temp2.addClass(`selectedNoteTooltip selectedNoteTooltip${beforeSelected}`)
        beforeSelected = beforeSelected.toLowerCase();
        if(mafiaTeam.includes(beforeSelected.toLowerCase())){
            
            if($("#noteTooltipMafiaPanel").css("display") == "none"){
                $("#noteTooltipSelectCitizen").removeClass();
                $("#noteTooltipSelectCitizen").addClass("unselectedNoteTooltipSelect");
                $("#noteTooltipSelectMafia").removeClass();
                $("#noteTooltipSelectMafia").addClass("selectedNoteTooltipSelect");
                $("#noteTooltipCitizenPanel").css("display", "none");
                $("#noteTooltipMafiaPanel").css("display", "block");
            }
        }else{
            if($("#noteTooltipCitizenPanel").css("display") == "none"){
                $("#noteTooltipSelectMafia").removeClass();
                $("#noteTooltipSelectMafia").addClass("unselectedNoteTooltipSelect");
                $("#noteTooltipSelectCitizen").removeClass();
                $("#noteTooltipSelectCitizen").addClass("selectedNoteTooltipSelect");
                $("#noteTooltipMafiaPanel").css("display", "none");
                $("#noteTooltipCitizenPanel").css("display", "block");
            }
        }
    }
    
   
});

/* NOTE TOOLTIP CITIZNE VS MAFIA */
$(document).on("click", "#noteTooltipSelectCitizen", function(){
    if($("#noteTooltipCitizenPanel").css("display") == "none"){
        $("#noteTooltipSelectMafia").removeClass();
        $("#noteTooltipSelectMafia").addClass("unselectedNoteTooltipSelect");
        $("#noteTooltipSelectCitizen").removeClass();
        $("#noteTooltipSelectCitizen").addClass("selectedNoteTooltipSelect");
        $("#noteTooltipMafiaPanel").css("display", "none");
        $("#noteTooltipCitizenPanel").css("display", "block");
    }
});

$(document).on("click", "#noteTooltipSelectMafia", function(){
    if($("#noteTooltipMafiaPanel").css("display") == "none"){
        $("#noteTooltipSelectCitizen").removeClass();
        $("#noteTooltipSelectCitizen").addClass("unselectedNoteTooltipSelect");
        $("#noteTooltipSelectMafia").removeClass();
        $("#noteTooltipSelectMafia").addClass("selectedNoteTooltipSelect");
        $("#noteTooltipCitizenPanel").css("display", "none");
        $("#noteTooltipMafiaPanel").css("display", "block");
    }
});

$(document).on("click", ".noteTooltipCard", function(){
    if($(".noteTooltipCard").hasClass("selectedNoteTooltip")==true){
        // $(".noteTooltipCard").removeClass("selectedNoteTooltip");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipPolice");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipDoctor");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipSoldier");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipPolitician");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipDetective");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipPsychic");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipReporter");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipTerrorist");
        // $(".noteTooltipCard").removeClass("selectedNoteTooltipMafia");
        $(".noteTooltipCard").removeClass(function (index, className) {
            let temp = className.match(/(select)\w+/g);
            if(temp){
                return temp.join(' ');
            }
            return '';
        });

        $(this).addClass("selectedNoteTooltip")
        $(this).addClass("selectedNoteTooltip"+$(this).attr("job"));
    }else{
        $(this).addClass("selectedNoteTooltip");
        $(this).addClass("selectedNoteTooltip"+$(this).attr("job"));
    }
});










$(window).resize(function () {
    $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) - parseFloat($("#upperGameContainer").css("height")) - 40 + "px"))
})

socket.on('refreshRoom', function (data) {

    gameData = data;
    refreshGame()


})


socket.on('startGame', function () {
    $('#roomMasterArea').html(`<div class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
    $('#roomMasterArea').css('height', "0px")
    clearChattingArea();
    $("#roomMasterArea").html('');

    $("#leftContainer").css('display', 'none');
    $("#leftGameContainer").css('display', 'block');

    inGameVisibility();
})

socket.on('getTimeStatus', function (time) {

    let minute = Math.floor(time / 60);
    let second = time % 60;
    if(second < 10){
        second = '0' + second;
    }else{
        second = '' + second;
    }
    minute = '0' + minute;
    $('#roomConditionBoxTime').text(`${minute} : ${second}`);

})


socket.on('getDateStatus', function (n, dayORnight) {
    $('#roomConditionBoxText').html(n + " 일차 " + dayORnight);
    if(dayORnight == "낮"){
        $('#roomConditionBoxImg').addClass('morning').removeClass('night')
        $('#gameArea').hide().removeClass('nightBg').addClass('morningBg').fadeIn(400);
    }else if(dayORnight == "밤"){
        $('#roomConditionBoxImg').addClass('night').removeClass('morning')
        $('#gameArea').hide().removeClass('morningBg').addClass('nightBg').fadeIn(400);
    }
    noticeAppend(dayORnight + "이 되었습니다.")
})


socket.on('gameMessage', function (message) {
    noticeAppend(message);
})


socket.on('appeal', function (player) {
    noticeAppend(`<span style='font-weight:1000;color:#${getColor(player)}'>${player}</span> - 최후의 변론`);
})


socket.on('initJob', function (job) {


    noticeAppend(`당신은 ${job}입니다.`);

    currentJob = job;

   
})

socket.on('selectPlayerAvailable', function (message, selectableMember) {
    noticeAppend(message);

    $(`.member`).css('cursor', "not-allowed");
    for (i in selectableMember) {
        $(`.member[member-data=${selectableMember[i]}]`).css('cursor', "pointer");
    }
    $(".member").on("click", function () {

        if (selectableMember.includes($(this).attr('member-data'))) {
            if (!$(this).hasClass("selected")) {
                $('.member').css("border", "0px");
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                $(this).css("border", "5px solid red");
                socket.emit('selectPlayer', currentRoom, $(this).attr('member-data'));
            } else {

            }
        }



    });

})

socket.on('selectPlayerUnvailable', function (message) {

    $(".member").off("click");

})


socket.on('votedPlayer', function (player) {
    noticeAppend(`${player}`)
});

socket.on('mafiaAbility', function (memberName) {
    noticeAppend(memberName + "(이)가 마피아에 의해 죽었습니다.");
    $(`.member[member-data=${memberName}]`).addClass("dead");
});


socket.on('doctorAbility', function (memberName) {
    noticeAppend(memberName + "(이)가 의사의 치료를 받고 살아났습니다.");

});

socket.on('soldierAbility', function (memberName) {
    noticeAppend(memberName + "(이)가 마피아의 공격을 버텨냈습니다! 장하다 국군 장병!");

});

socket.on('politicianAbility', function (memberName) {
    noticeAppend(`정치인은 투표로 죽지 않습니다. 장하다 정치인!`);
});

socket.on('reporterAbility', function (memberName, jobName) {
    noticeAppend(`(충격,공포,실화) ${memberName}이(가) ${jobName}(이)라고? 삐슝빠슝뿌슝`);
});

socket.on('priestAbility', function (memberName) {
    noticeAppend(`${memberName}가 부활했습니다.`);
});



socket.on('voteResult', function (memberName, isDie) {
    if (isDie) {
        noticeAppend(memberName + "(이)가 투표로 처형당했습니다.");
        $(`.member[member-data=${memberName}]`).addClass("dead");
    } else {
        noticeAppend(memberName + "(이)가 투표에서 살아남았습니다.");
    }

});

socket.on('finalVote', function (member) {
    $('#finalVoteModal div.modal-body').html(`<span style="font-weight:800;font-size:20px;color:#${getColor(member)};">${member}</span> - 처형`);
    $('#finalVoteModal').modal();

    $('#agreeVote').on("click", function () {
        socket.emit('selectPlayer', currentRoom, 1);
    })
    $('#disagreeVote').on("click", function () {
        socket.emit('selectPlayer', currentRoom, 0);
    })
})


socket.on('endFinalVote', function () {
    $('#agreeVote').off("click");
    $('#disagreeVote').off("click");
    $('#finalVoteModal').modal('hide');
})


socket.on('endGame', function () {

    clearChattingArea()

    let roomName = currentRoom

    if (info[roomName].members[0] === getMyName()) {
        $('#roomMasterArea').html(`<div id="chatRoomManage" class="btn btn-secondary" style="margin-right:0px ; width:80%;height:40px">방 관리</div><div id="startGame" class="btn btn-danger" style="width:20%;height:40px">게임 시작</div>`)
        $('#roomMasterArea').css('height', "40px")
        $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) - parseFloat($("#roomMasterArea").css("height")) - parseFloat($("#chatSendArea").css("height"))) + "px")
    } else {
        $('#roomMasterArea').html(`<div class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
        $('#roomMasterArea').css('height', "0px")
        $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) - parseFloat($("#roomMasterArea").css("height")) - parseFloat($("#chatSendArea").css("height"))) + "px")

    }

    rightPanelVisibility()
    roomManageVisibility();
    inGameVisibility();



    


    $("#noteTooltipWrap").removeClass();
    $(".hideCard").removeClass("hideCard");
    $("#noteTooltipWrap").fadeOut(150);
    $('#notePanel').html();

    noticeAppend("게임이 끝났습니다.");
})


socket.on('noticeGameResult', function (winner, resultTime) {
    if (winner == "mafiaWin") {
        noticeAppend("마피아 팀이 승리하였습니다.");
    } else if (winner == "citizenWin") {
        noticeAppend("시민 팀이 승리하였습니다.");
    }
    noticeAppend(`${resultTime}초 후 로비로 복귀합니다.`);
})


socket.on('policeResult', function (selected, result) {
    if (result) {
        noticeAppend(`${selected}는 마피아입니다.`)
        setJob(selected, "mafia")

    } else {
        noticeAppend(`${selected}는 마피아가 아닙니다.`)
    }
})

socket.on('shamanResult', function (selected, result) {
    if (result) {
        noticeAppend(`${selected}는 ${result}였습니다.`);
    }
})

socket.on('detectiveResult', function (selected, result) {
    if (result) {
        noticeAppend(`${selected}가 ${result}지목 `);
    }
})


socket.on('mafiaSelected', function (selected) {
    $temp = $(`.member[member-data=${selected}]`);

    if (!$temp.hasClass("selected")) {
        $('.member').css("border", "0px");
        $('.selected').removeClass('selected');
        $temp.addClass('selected');
        $temp.css("border", "5px solid red");

    } else {

    }

})
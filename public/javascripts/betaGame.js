
$(window).resize(function () {
    $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) - parseFloat($("#upperGameContainer").css("height")) - 40 + "px"))
})

socket.on('refreshRoom', function (data2) {

    if (info[currentRoom].isPlaying) {
        let data = data2.members;

        $('#gameMembers').html('');
        for (let i in data) {
            if (data2.alive.includes(data[i])) {
                $('#gameMembers').append(`
                <div member-data="${data[i]}" class="card member" style="float:left;display:inline-block;">
                    <img src="../images/icon_player.png" class="card-img-top" alt="...">
                    <div class="card-body" style="text-align:center;padding-left:0px; padding-right:0px; padding-top:8px;">
                        <div class="${currentName == data[i] ? 'myName' : ''}" style="font-size:18px; height:36px;color:#${getColor(data[i])}; font-weight:500;">
                            ${data[i]}
                        </div>    
                    
                    </div>
                </div>`

                )
            } else {
                $('#gameMembers').append(`
                <div member-data="${data[i]}" class="card member dead" style="float:left;display:inline-block;">
                    <img src="../images/icon_player.png" class="card-img-top" alt="...">
                    <div class="card-body" style="text-align:center;padding-left:0px; padding-right:0px; padding-top:8px">
                        <div class="${currentName == data[i] ? 'myName' : ''}" style="font-size:18px; height:36px;color:#${getColor(data[i])}; font-weight:500;">
                            ${data[i]}
                        </div>    
                    
                    </div>
                </div>`

                )
            }

            // 
        }

        $('#gameMembers').find('img').on('load', function () {
            $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) - parseFloat($("#upperGameContainer").css("height")) - 40 + "px"))
        });
    }


})


socket.on('startGame', function () {
    $('#roomMasterArea').html(`<div class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
    $('#roomMasterArea').css('height', "0px")
    clearChattingArea();
    $("#roomMasterArea").html('');

    $("#leftContainer").css('display', 'none');
    $("#leftGameContainer").css('display', 'block');
})

socket.on('getTimeStatus', function (time) {

    $('#timeStatus').html(time);

})


socket.on('getDateStatus', function (n, dayORnight) {
    $('#dateStatus').html(n + " 번째 " + dayORnight);
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


    namePopover(roomName);

    $("#leftContainer").css('display', 'block');
    $("#leftGameContainer").css('display', 'none');

    $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) - parseFloat($("#exitRoom").css("height")) - parseFloat($("#upperRoomContainer").css("height"))) + "px")

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
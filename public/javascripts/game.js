
$(window).resize(function(){
    $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) -  parseFloat($("#upperGameContainer").css("height")) -  40 + "px"))
})

socket.on('refreshRoom', function(data2){
    let data = data2.members;

    $('#gameMembers').html('');
    for(let i in data){
        if(data2.alive.includes(data[i])){
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
        }else{
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
    
    $('#gameMembers').find('img').on('load', function(){
        $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) -  parseFloat($("#upperGameContainer").css("height")) -  40 + "px"))
    });
})


socket.on('startGame', function(){
    $('#roomMasterArea').html(`<div class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
    $('#roomMasterArea').css('height', "0px")
    $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
    $("#chatting").html('');
    $("#roomMasterArea").html('');

    $("#leftContainer").css('display', 'none');
    $("#leftGameContainer").css('display', 'block');
  })

socket.on('getTimeStatus', function(time){

    $('#timeStatus').html(time);
    
})


socket.on('getDateStatus', function(n,dayORnight){
    $('#dateStatus').html(n + " 번째 " + dayORnight);
    chatAppend("noticeDanger", dayORnight + "이 되었습니다.")
})


socket.on('gameMessage', function(message){
    chatAppend("noticePrimary", message);
})


socket.on('appeal', function(player){
    chatAppend("noticePrimary", `<span style='font-weight:1000;color:#${getColor(player)}'>${player}</span> - 최후의 변론`);
})


socket.on('initJob', function(job){
    chatAppend("noticeWarning", `당신은 ${job}입니다.`);
})

socket.on('selectPlayerAvailable', function(message, selectableMember){
    chatAppend('noticePrimary', message);

    $(`.member`).css('cursor', "not-allowed");
    for(let i in selectableMember){
        $(`.member[member-data=${selectableMember[i]}]`).css('cursor', "pointer");
    }
    $(".member").on("click", function(){

        if(selectableMember.includes($(this).attr('member-data'))){
            if(!$(this).hasClass("selected")){
                $('.member').css("border", "0px");
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                $(this).css("border", "5px solid red");
                socket.emit('selectPlayer', currentRoom, $(this).attr('member-data'));
            }else{
               
            }
        }
        
        
        
    });

})

socket.on('selectPlayerUnvailable', function(message){

    $(".member").off("click");

})


socket.on('votedPlayer', function(player){
    chatAppend('vote', `${player}`)
});

socket.on('mafiaAbility', function(memberName){
    chatAppend("noticeDanger", memberName + "(이)가 마피아에 의해 죽었습니다.");
    $(`.member[member-data=${memberName}]`).addClass("dead");
});


socket.on('doctorAbility', function(memberName){
    chatAppend("noticePrimary", memberName + "(이)가 의사의 치료를 받고 살아났습니다.");

});

socket.on('soldierAbility', function(memberName){
    chatAppend("noticePrimary", memberName + "(이)가 마피아의 공격을 버텨냈습니다! 장하다 국군 장병!");

});

socket.on('politicianAbility', function(memberName){
    chatAppend("noticePrimary", `정치인은 투표로 죽지 않습니다. 장하다 정치인!`);
});

socket.on('reporterAbility', function(memberName, jobName){
    chatAppend("noticePrimary", `(충격,공포,실화) ${memberName}이(가) ${jobName}(이)라고? 삐슝빠슝뿌슝`);
});

socket.on('priestAbility', function(memberName){
    chatAppend("noticePrimary", `${memberName}가 부활했습니다.`);
});



socket.on('voteResult', function(memberName, isDie){
    if(isDie){
        chatAppend("noticeDanger", memberName + "(이)가 투표로 처형당했습니다.");
        $(`.member[member-data=${memberName}]`).addClass("dead");
    }else{
        chatAppend("noticeDanger", memberName + "(이)가 투표에서 살아남았습니다.");
    }
    
});

socket.on('finalVote', function(member){
    $('#finalVoteModal div.modal-body').html(`<span style="font-weight:800;font-size:20px;color:#${getColor(member)};">${member}</span> - 처형`);
    $('#finalVoteModal').modal();

    $('#agreeVote').on("click", function(){
        socket.emit('selectPlayer', currentRoom, 1);
    })
    $('#disagreeVote').on("click", function(){
        socket.emit('selectPlayer', currentRoom, 0);
    })
})


socket.on('endFinalVote', function(){
    $('#agreeVote').off("click");
    $('#disagreeVote').off("click");
    $('#finalVoteModal').modal('hide');
})


socket.on('endGame', function(){

    $('#chatting').html('');

    let roomName = currentRoom

    if(info[roomName].members[0] === getMyName()){
        $('#roomMasterArea').html(`<div id="chatRoomManage" class="btn btn-secondary" style="margin-right:0px ; width:80%;height:40px">방 관리</div><div id="startGame" class="btn btn-danger" style="width:20%;height:40px">게임 시작</div>`)
        $('#roomMasterArea').css('height', "40px")
        $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
    }else{
        $('#roomMasterArea').html(`<div class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
        $('#roomMasterArea').css('height', "0px")
        $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")

    }

    if(!currentRoom){
        $('#chatContainer').css('visibility', 'hidden');
        $('#exitRoom').css('visibility', 'hidden');
    }else{
        $('#chatContainer').css('visibility', 'visible');
        $('#exitRoom').css('visibility', 'visible');
    }



    namePopover(roomName);

    $("#leftContainer").css('display', 'block');
    $("#leftGameContainer").css('display', 'none'); 

    $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")

    chatAppend("noticeDanger", "게임이 끝났습니다.");

    


    
})


socket.on('noticeGameResult', function(winner, resultTime){
    if(winner == "mafiaWin"){
        chatAppend("noticePrimary", "마피아 팀이 승리하였습니다.");
    }else if(winner == "citizenWin"){
        chatAppend("noticePrimary", "시민 팀이 승리하였습니다.");
    }
    chatAppend("noticePrimary", `${resultTime}초 후 로비로 복귀합니다.`);
})


socket.on('policeResult', function(selected, result){
    if(result){
        chatAppend("noticeDanger", `${selected}는 마피아입니다.`)
    }else{
        chatAppend("noticePrimary", `${selected}는 마피아가 아닙니다.`)
    }
})

socket.on('shamanResult', function(selected, result){
    if(result){
        chatAppend("noticeDanger", `${selected}는 ${result}였습니다.`);
    }
})

socket.on('detectiveResult', function(selected, result){
    if(result){
        chatAppend("noticeDanger", `${selected}가 ${result}지목 `);
    }
})


socket.on('mafiaSelected', function(selected){
    $temp = $(`.member[member-data=${selected}]`);

    if(!$temp.hasClass("selected")){
        $('.member').css("border", "0px");
        $('.selected').removeClass('selected');
        $temp.addClass('selected');
        $temp.css("border", "5px solid red");
        
    }else{
        
    }

})
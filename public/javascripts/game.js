
$(window).resize(function(){
    $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) -  parseFloat($("#upperGameContainer").css("height")) -  40 + "px"))
})
socket.on('refreshMain', function(data2){

    let data = data2[currentRoom].members;

    $('#gameMembers').html('');
    for(let i in data){
        $('#gameMembers').append(`
        <div memberData="${data[i]}" class="card member" style="float:left;display:inline-block;">
            <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png" class="card-img-top" alt="...">
            <div class="card-body" style="text-align:center;padding-left:0px; padding-right:0px; padding-top:8px">
                <div style="font-size:18px; height:36px;color:#${getColor(data[i])}; font-weight:500;">
                    ${data[i]}
                </div>    
            
            </div>
        </div>`
      )
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


socket.on('getDateStatus', function(date){
    $('#dateStatus').html(date);
})

socket.on('getGameMembers', function(data){
    $('#gameMembers').html('');
    for(let i in data){
        $('#gameMembers').append(`
        <div memberData="${data[i]}" class="card member" style="float:left;display:inline-block;">
            <img src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png" class="card-img-top" alt="...">
            <div class="card-body" style="text-align:center;padding-left:0px; padding-right:0px; padding-top:8px">
                <div style="font-size:18px; height:36px;color:#${getColor(data[i])}; font-weight:500;">
                    ${data[i]}
                </div>    
            
            </div>
        </div>`
      )
    }
    $('#gameMembers').find('img').on('load', function(){
        $("#gameMembers").css("height", (parseFloat($("#leftGameContainer").css("height")) -  parseFloat($("#upperGameContainer").css("height")) -  40 + "px"))
    });

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
})
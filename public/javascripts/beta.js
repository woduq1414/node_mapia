


  //  var docV = document.documentElement;
  //  // 전체화면 설정
  //  function openFullScreenMode() {
  //      if (docV.requestFullscreen)
  //          docV.requestFullscreen();
  //      else if (docV.webkitRequestFullscreen) // Chrome, Safari (webkit)
  //          docV.webkitRequestFullscreen();
  //      else if (docV.mozRequestFullScreen) // Firefox
  //          docV.mozRequestFullScreen();
  //      else if (docV.msRequestFullscreen) // IE or Edge
  //          docV.msRequestFullscreen();
  //  }

  //  openFullScreenMode();
userClass = {};


function RightPanelVisibility(){
  if(currentRoom){
    $('#rightPanel').css('visibility', 'visible');
    
  }else{
    $('#rightPanel').css('visibility', 'hidden');

  }
}

function noticeAppend(text){
  let string = `
  <div class="alertBox">
    ${text}
  </div>
  <br>
  `
  $('#gameAreaWrap').append(string);
  $('#gameArea').scrollTop($('#gameArea')[0].scrollHeight);
}

function getNameSpan(name){
  return `<span class="name ${userClass[name]}">${name}</span>`
}



function refreshRoomTitleBox(){
  $('#roomTitleBox').html(`${currentRoom}<br><span style="font-size: 14px">(${info[currentRoom].members.length}/${info[currentRoom].limit})</span>`)
}



  function getColor(text){
    var hash = 0, len = text.length;
    if (text.length === 0) {
        return hash;
    }
    for (i = 0; i < len; i++) {
        charC = text.charCodeAt(i);
        hash = ((hash<<5)-hash)+charC;
        hash = hash & hash; 
    }
    
    hash = hash * hash
    hash = hash % 16777216
    hash = hash.toString(16)
    return hash;
}

function getMyName(){


  // $.ajax({
  //     type: "POST",
  //     url: "/getName",
  //     data: {'id' : users[socket.id]},
  //     async: false,
  //     success:function(data){
  //         //console.log(data)
  //         currentName = data.name.trim();
  //     }
  // });
  // console.count("getMyName")


  return currentName;

}

function chatSend(){
  var name = $('#myInfoName').text().trim();
  var text = $('#chatArea').val();
  socket.emit('sendChat', currentRoom, socket.id, text);
  $('#chatArea').val('');
}


function chatAppend(type, text){
//   if(type == "noticePrimary"){
//     $('#chatting').append("<div class='alert alert-primary' style='text-align:center'>" + text + "</div>");
//   }else if(type == "noticeWarning"){
//     $('#chatting').append("<div class='alert alert-warning' style='text-align:center'>" + text + "</div>");
//   }else if(type == "chat"){
//     $('#chatting').append("<div class='alert alert-light' style='text-align:left'>" + text + "</div>");
//   }else if(type == "noticeDanger"){
//     $('#chatting').append("<div class='alert alert-danger' style='text-align:center'>" + text + "</div>");
//   }else if(type == "vote"){
//     $('#chatting').append("<div class='alert alert-light' style='text-align:center; color : red'>" + text + "</div>");
//   }
//   $("#chatting").scrollTop($("#chatting")[0].scrollHeight); 
    console.log(text);
}

function namePopover(roomName){

  if(info[roomName].members[0] == getMyName() && !info[roomName].isPlaying){

      $('.chatName').each(function(){
        $temp = $(this)
        $(this).popover({
          placement: 'bottom',
          trigger: 'click',
          html: true,
          sanitize: false,
          title: `<span>${$(this).attr("data-sname")}</span>   <a class="close"><i style="font-size:20px" class="fas fa-times"></i></a>`,
          content: 
          `
                <button data="${$(this).attr("data-sid")}" class="btn btn-primary mandate" type="button" data-toggle="popover" data-placement="bottom" data-html="true" >방장 위임</button>
                <button data="${$(this).attr("data-sid")}" class="btn btn-danger kick" type="button" data-toggle="popover" data-placement="bottom" data-html="true" >나가 ㅋ</button>
          `
          
        }).on('shown.bs.popover', function(e) {
        
          var current_popover = '#' + $(e.target).attr('aria-describedby');
          console.log(current_popover)
          var $cur_pop = $(current_popover);
        
          $cur_pop.find('.close').click(function(){
              //console.log('close triggered');
              $('.chatName').popover('hide');
          });
          $cur_pop.find('.mandate').click(function(){
              //console.log('close triggered');
              $('.chatName').popover('hide');
          });
          $cur_pop.find('.kick').click(function(){
              //console.log('close triggered');
              $('.chatName').popover('hide');
          });
          
        });
      });
     
  }else{
    $('.chatName').popover('dispose')
  }
};

//var socket = io(); 

var socket = io({transports: ['websocket'], upgrade: false});

var currentRoom;
var info;
var users;
var currentName = $('#myInfoName').text().trim();
var config = {};
config.VolumeSFX = 0.5;
config.checkPushAlarm = 1;
config.checkChattingSFX = 1;


$(document).ready(function(){
  

  RightPanelVisibility();
  socket.emit('initName', currentName);
})





  





//$("#changeRoomNameArea").keyup(function(e){if(e.keyCode == 13)  $(this).parents('swal2-content').next().find('button').trigger("click") });


$(document).on("click", "#startButton", function(){
  socket.emit('startGame', currentRoom);
})



$(document).on("click", "#roomSettingButton", function(){
  Swal.fire({
    title: 'Room Manage',
    html: `
<div class="input-group mb-3">
<div class="input-group-prepend">
<span class="input-group-text" id="basic-addon1">방 이름</span>
</div>
<input type="text" id="changeRoomNameArea" class="form-control" placeholder="방 이름" aria-label="방 이름" aria-describedby="basic-addon1" value="${currentRoom}">
</div>
<div class="input-group mb-3">
<div class="input-group-prepend">
<span class="input-group-text" id="basic-addon1">최대 인원</span>
</div>
<input type="text" id="changeRoomLimitArea" class="form-control" placeholder="최대 인원" aria-label="최대 인원" aria-describedby="basic-addon1" value="${info[currentRoom].limit}">
</div>
<div class="input-group mb-3">
<div class="input-group-prepend">
<div class="input-group-text">
  비밀번호
</div>
<div class="input-group-text">
  <input id="changePasswordCheck" type="checkbox" aria-label="Checkbox for following text input" ${info[currentRoom].password ? "checked" : ""}>
</div>
</div>
<input id="changePasswordArea" type="password" class="form-control" aria-label="Text input with checkbox" ${info[currentRoom].password ? "" : "disabled"}>
</div>
`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Apply',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showClass: {
        popup: 'animated fadeInUpBig faster'
    },
    hideClass: {
        popup: 'animated fadeOutDownBig faster'
    },
    preConfirm : () => {
     

      let passwordCheck = $('#changePasswordCheck').is(":checked")
      if (passwordCheck){
        password = $('#changePasswordArea').val();
        socket.emit('changePassword', currentRoom, password)
      }else{
        password = "";
        socket.emit('changePassword', currentRoom, password)
      }

      let before = info[currentRoom].limit
      let after = $('#changeRoomLimitArea').val()
      if (before != after){
        socket.emit('changeRoomLimit', currentRoom, before, after)
        
      }


      before = currentRoom
      after = $('#changeRoomNameArea').val()
      if (before != after){
        socket.emit('changeRoomName', before, after)
        currentRoom = after;
      }
    }
   
  })
})



$(document).on("click", "#chatSend", function(){
  chatSend();
})
$("#chatArea").keyup(function(e){if(e.keyCode == 13)  chatSend(); });

// $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
// $(window).resize(function(){
//   $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
// })



// $(window).resize(function(){
//   $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")
// })





$(document).on("click", "#passwordCheck", function(){
  if($(this).is(":checked")){
    $('#passwordArea').prop("disabled", false)
  }else{
    $('#passwordArea').prop("disabled", true)
  }
})
$(document).on("click", "#changePasswordCheck", function(){
  if($(this).is(":checked")){
    $('#changePasswordArea').prop("disabled", false)
  }else{
    $('#changePasswordArea').prop("disabled", true)
  }
})


$(document).on("click", "#exitButton", function(){
  socket.emit('leaveRoom', currentRoom);
})

$(document).on("click", "#exitGame", function(){
  
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

  socket.emit('leaveRoom', currentRoom);
})

$(document).on("click", ".logout", function(){
  location.href = "/logout"
})

$(document).on("click", "#addRoom", function(){

  Swal.fire({
    title: 'Room Name',
    html: `
<div class="input-group mb-3">
<div class="input-group-prepend">
<span class="input-group-text" id="basic-addon1">방 이름</span>
</div>
<input type="text" id="roomNameArea" class="form-control" placeholder="방 이름" aria-label="방 이름" aria-describedby="basic-addon1">
</div>
<div class="input-group mb-3">
<div class="input-group-prepend">
<span class="input-group-text" id="basic-addon1">최대 인원</span>
</div>
<input type="text" id="roomLimitArea" class="form-control" placeholder="최대 인원" aria-label="최대 인원" aria-describedby="basic-addon1" value="12">
</div>
<div class="input-group mb-3">
<div class="input-group-prepend">
<div class="input-group-text">
  비밀번호
</div>
<div class="input-group-text">
  <input id="passwordCheck" type="checkbox" aria-label="Checkbox for following text input">
</div>
</div>
<input id="passwordArea" type="password" class="form-control" aria-label="Text input with checkbox" disabled>
</div>
`,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Apply',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showLoaderOnConfirm: true,
    showClass: {
        popup: 'animated fadeInUpBig faster'
    },
    hideClass: {
        popup: 'animated fadeOutDownBig faster'
    },
    preConfirm : () => {
      let password;
      let roomName = $('#roomNameArea').val()
      let passwordCheck = $('#passwordCheck').is(":checked")
      if (passwordCheck){
        password = $('#passwordArea').val()
      }else{
        password = "";
      }
      let roomLimit = $('#roomLimitArea').val();
    
      console.log(roomName, passwordCheck, password);
      if(getMyName()){
          socket.emit('makeRoom', roomName, password, roomLimit);
          socket.emit('joinRoom', roomName, getMyName());
      }
   
    }
  })

})

$(document).on("click", ".room", function(){

  var roomName = $(this).attr('room-data')
  
  if (roomName != currentRoom){
    if(info[roomName].password){
      Swal.fire({
        title: 'Password',
        text: '비번',
        input: 'password',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Make & Enter',
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
          console.log(roomName, password)
          socket.emit('checkPassword', roomName, password);
          
          
          
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    }else{
      socket.emit('joinRoom', roomName, getMyName());
    }
  }
  

})

$(document).on("click", ".mandate", function(){
  let socketID = $(this).attr('data')
  socket.emit('mandateRoomMaster', currentRoom, socketID )
  
})
$(document).on("click", ".kick", function(){
  let socketID = $(this).attr('data')
  socket.emit('kick', currentRoom, socketID )
  
})


socket.on('refreshUser', function(data){
  users = data;
  console.log(users);
})


socket.on('changePassword', function(roomName, type){
  if(type == 0){
    noticeAppend(`방의 비밀번호가 해제되었습니다.`)
  }else{
    noticeAppend(`방의 비밀번호가 변경되었습니다.`)
  }
})

socket.on('changeRoomLimit', function(before, after){
  noticeAppend(`방의 최대 인원이 ${before}에서 ${after}로 변경되었습니다.`)

})

socket.on('changeRoomLimitErr', function(){
  Swal.fire({
    icon: 'error',
    title: '저런',
    text: '현재 인원보다 최대 인원이 작으면 안됨ㅋ'
  })
})

socket.on('changeRoomName', function(before,after){
  currentRoom = after;
  noticeAppend(`방의 이름이 ${before}에서 ${after}로 변경되었습니다.`)

})

socket.on('a',function(data){
  console.log(data);
})



socket.on('newRoomMaster', function(roomName, name, socketID){

  noticeAppend(`${getNameSpan(name)} 님이 방장이 되었습니다.`)

 
  namePopover(roomName);
})


socket.on('receiveChat', function(socketID, roomName, name, text, type, me){
  let string;
  let isRoomMaster = info[roomName].members[0] == name && !info[roomName].isPlaying;
  string = `
  <div class="talkBox ${me ? "myBox" : "otherBox"}">
      <div class="talkerName ${me ? "myBox" : "otherBox"}">
        ${isRoomMaster ? '<span class="crown"></span>' : ''}<span class="nameWrap">${name}</span>
      </div>
      <br>
      <div class="talkContentBox">
          <div class="talkContentWrap ${me ? "myContentBox" : "otherContentBox"}">
              ${text}
          </div>
      </div>
  </div>
  `
  $('#gameAreaWrap').append(string);
  $('#gameArea').scrollTop($('#gameArea')[0].scrollHeight);

  // if(currentName != name && !isFocus && !info[roomName].isPlaying){
  //   if(config.checkPushAlarm){
  //     Push.create(name, {
  //       body: text,
  //       icon: '/images/icon_player.png',
  //       timeout: 3000,
  //       onClick: function () {
  //           window.focus();
  //           this.close();
  //       }
  //     });
  //   }
  //   if(config.checkChattingSFX){
  //     var audio = document.getElementById('audio_play'); 
  //     audio.volume = config.VolumeSFX;
  //     if (audio.paused) { 
  //         audio.play(); 
  //     }else{ 
  //         audio.pause(); 
  //         audio.currentTime = 0 
  //         audio.play(); 
  //     } 
  //   }
    

    
  // }


  namePopover(roomName);


})

var isFocus = 1;

$(window).focus(function() {
  isFocus = 1;
});

$(window).blur(function() {
  isFocus = 0;
});



socket.on('noticeChangeName', function(before, after, socketID){

  chatAppend("noticePrimary", `<span class="chatName" data-sname='${before}' data-sid='${socketID}' style='font-weight:1000;color:#${getColor(before)}'>${before}</span>님이 <span class="chatName" data-sname='${after}' data-sid='${socketID}' style='font-weight:1000;color:#${getColor(after)}'>${after}</span>로 이름 바꿈 ㅋ`);
  namePopover(currentRoom);
})





socket.on('checkPassword', function(roomName, isCorrect){
  console.log(isCorrect);
  if (isCorrect){
    
    socket.emit('joinRoom', roomName, getMyName());
    //socket.removeListener('checkPassword');
  }else{
    Swal.fire({
      icon: 'error',
      title: '저런',
      text: '비밀번호 틀렸음 ㅋ'
    })
  }
})

socket.on('exceedRoomLimit', function(roomName){
  Swal.fire({
    icon: 'error',
    title: '저런',
    text: '최대 인원 넘어감ㅋ'
  })
})


$(document).on("click", "#setName", function(){

  var a = $('#myInfoName').text().trim();
  var b = $('#inputName').val()

  socket.emit('changeName', a, b)
  
})





socket.on('joinRoom', function(roomName, name, socketID, me){
  if (me){
    $('#gameAreaWrap').html('');
  }
  

  noticeAppend(`${getNameSpan(name)} 님이 입장했습니다`)


  currentRoom = roomName;
  
  
  RightPanelVisibility();
  refreshRoomTitleBox();

  namePopover(roomName);

  
})
  
socket.on('leaveRoom', function(roomName, name, socketID, me){
  console.log(roomName, name, me);
  noticeAppend(`${getNameSpan(name)} 님이 퇴장했습니다.`)

  if(me){
    currentRoom = undefined;
  }
  
  RightPanelVisibility();

  namePopover(roomName);
})
  
socket.on('kickedRoom', function(roomName, name, socketID, me){
  console.log(roomName, name, me);
  noticeAppend(`${getNameSpan(name)} 님이 방장에 의해 강제퇴장 당했습니다.`)
  if(me){
    currentRoom = undefined;
    Swal.fire({
      icon: 'error',
      title: 'ㅋㅋㅋㅋㅋㅋㅋ',
      text: '강퇴 당함 ㅋ'
    })
  }
  
  RightPanelVisibility();
  namePopover(roomName);
})
  



socket.on('failSetName', function(){
  alert("이미 있는 이름임ㅋ");
})

socket.on('successSetName', function(){
  $('#myInfoName').text($('#inputName').val())
  currentName = $('#inputName').val()
})




socket.on('refreshMain', function(data){
  //alert(data);
  info = data;

  //$('[data-toggle="tooltip"]').tooltip('hide')
  
  console.log(data);
  var string = "";
  for (roomName in data){
    if(data[roomName].isPlaying) continue;


    // if(data[key]["members"].includes(getMyName())){
    //   string += `
    //   <div class='room alert alert-warning d-flex justify-content-between '
    //   data-toggle='tooltip' data-placement='bottom' data-html='true' title="${popup}"> 
    //     <div class='roomName' style="display: block;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">${key}</div>
    //     <div class='roomLimit '>(${data[key].members.length}/${data[key].limit})</div>
    //   </div>`
    // }else{
    //   string += `
    //   <div class='room alert alert-info d-flex justify-content-between '
    //   data-toggle='tooltip' data-placement='bottom' data-html='true' title="${popup}"> 
    //     <div class='roomName' style="display: block;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">${key}</div>
    //     <div class='roomLimit '>(${data[key].members.length}/${data[key].limit})</div>
    //   </div>`
    // }
    let dense;
    if(data[roomName].members.length / data[roomName].limit < 0.5){
        dense = "looseRoom"
    }else if(data[roomName].members.length / data[roomName].limit >= 1){
        dense = "fullRoom"
    }else if(data[roomName].members.length / data[roomName].limit >= 0.5){
        dense = "midRoom"
    }
    
    string += `
    <div class="${dense} room Room1" room-data="${roomName}">
        <div class="roomWrap">
            <div class="leftRoomArea">
                <div class="roomName">
                    ${roomName}
                </div>
                <div class="roomMember">
                    ${data[roomName].members.join(',')}
                </div>
            </div>
            <div class="rightRoomArea">
                <table class="rightRoomTable">
                    <tr>
                        <td>
                            <img class="joinRoom" src="/images/user.png">
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="roomCondition">
                                (${data[roomName].members.length}/${data[roomName].limit})
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    `
  }
  //alert(string);
  $('#roomContainer').html(string);

  if(currentRoom){
    refreshRoomTitleBox();  
  }
  
  
  RightPanelVisibility();
  //$('[data-toggle=" "]').tooltip()
  //$("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")
})

$('.config').on("click", function(){

    Swal.fire({
      title: 'Config',
      html: `
      <label for="VolumeSFX">효과음 크기</label>
      <input type="range" class="custom-range" id="VolumeSFX" min="0" max="1" step="0.1" value="${config.VolumeSFX}">
      
      <hr>
      <div class="custom-control custom-switch">
        
        <input type="checkbox" class="custom-control-input" id="checkPushAlarm" ${config.checkPushAlarm ? "checked" : ""}>
        <label class="custom-control-label" for="checkPushAlarm">화면을 보고 있지 않을 때 채팅 푸쉬 알림</label>
      </div>
      <div class="custom-control custom-switch">
        
        <input type="checkbox" class="custom-control-input" id="checkChattingSFX" ${config.checkChattingSFX ? "checked" : ""}>
        <label class="custom-control-label" for="checkChattingSFX">화면을 보고 있지 않을 때 채팅 효과음</label>
      </div>
      
`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Apply',
      inputAttributes: {
        autocapitalize: 'off'
      },
      preConfirm : () => {
       
        config.VolumeSFX = $('#VolumeSFX').val();
        config.checkPushAlarm = $('#checkPushAlarm').is(":checked")
        config.checkChattingSFX = $('#checkChattingSFX').is(":checked")
      
      }
     
    })

})

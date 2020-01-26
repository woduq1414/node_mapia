   

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
        var name = $('#currentName').text().trim();
        var text = $('#chatArea').val();
        socket.emit('sendChat', currentRoom, socket.id, text);
        $('#chatArea').val('');
      }

      
      function chatAppend(type, text){
        if(type == "noticePrimary"){
          $('#chatting').append("<div class='alert alert-primary' style='text-align:center'>" + text + "</div>");
        }else if(type == "chat"){
          $('#chatting').append("<div class='alert alert-light' style='text-align:left'>" + text + "</div>");
        }else if(type == "noticeDanger"){
          $('#chatting').append("<div class='alert alert-danger' style='text-align:center'>" + text + "</div>");
        }else if(type == "vote"){
          $('#chatting').append("<div class='alert alert-light' style='text-align:center; color : red'>" + text + "</div>");
        }
        $("#chatting").scrollTop($("#chatting")[0].scrollHeight);
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
      var currentName = $('#currentName').text().trim();
      
      $(document).ready(function(){
        if(!currentRoom){
          $('#chatContainer').css('visibility', 'hidden');
        }else{
          $('#chatContainer').css('visibility', 'visible');
        }

        $("#leftContainer").css('display', 'block');
        $("#leftGameContainer").css('display', 'none');

        $('#exitRoom').css('visibility', 'hidden');
        socket.emit('initName', currentName);
        $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")
      })
  
  
  
      
  
        
  
     
  
      
  
      //$("#changeRoomNameArea").keyup(function(e){if(e.keyCode == 13)  $(this).parents('swal2-content').next().find('button').trigger("click") });
  
  
      $(document).on("click", "#startGame", function(){
        socket.emit('startGame', currentRoom);
      })
  
  
  
      $(document).on("click", "#chatRoomManage", function(){
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
  
      $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
      $(window).resize(function(){
        $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
      })
  
  
  
      $(window).resize(function(){
        $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")
      })
  
  
  
  
  
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
  
  
      $(document).on("click", "#exitRoom", function(){
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
  
      $(document).on("click", "#makeRoom", function(){
  
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
  
        var roomName = $(this).children('.roomName').text();
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
          chatAppend("noticePrimary", `${roomName}의 비밀번호가 해제됨 ㅋ`);
        }else{
          chatAppend("noticePrimary", `${roomName}의 비밀번호가 변경됨 ㅋ`);
        }
      })
  
      socket.on('changeRoomLimit', function(before, after){
        chatAppend("noticePrimary", `방의 최대 인원이 ${before}에서 ${after}로 변경됨 ㅋ`);
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
        chatAppend("noticePrimary", `방의 이름이 ${before}에서 ${after}로 변경됨 ㅋ`);
      })
  
      socket.on('a',function(data){
        console.log(data);
      })
  
      
  
      socket.on('newRoomMaster', function(roomName, name, socketID){
  
        chatAppend("noticePrimary", `<span class='chatName' data-sname='${name}' data-sid='${socketID}' style='font-weight:1000;color:#${getColor(name)}'>${name}</span>님이 ${roomName}의 방장이 됨 ㅋ`)
  
        if(name === getMyName()){
          $('#roomMasterArea').html(`<div id="chatRoomManage" class="btn btn-secondary" style="margin-right:0px ; width:80%;height:40px">방 관리</div><div id="startGame" class="btn btn-danger" style="width:20%;height:40px">게임 시작</div>`)
          $('#roomMasterArea').css('height', "40px")
          $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
        }else{
          $('#roomMasterArea').html(`<div id="chatRoomManage" class="alert alert-secondary" style="width:100%;height:0px">방 관리</div>`)
          $('#roomMasterArea').css('height', "0px")
          $("#chatting").css("height", (parseFloat($("#chatContainer").css("height")) -  parseFloat($("#roomMasterArea").css("height")) -  parseFloat($("#chatSendArea").css("height"))) + "px")
       
        }
        namePopover(roomName);
      })
  
  
      socket.on('receiveChat', function(socketID, roomName, name, text, type){
        if(info[roomName].members[0] == name && !info[roomName].isPlaying){
          chatAppend("chat", `<span data-toggle="popover" data-placement="bottom"  data-html="true" data-sname='${name}' data-sid='${socketID}'
          class='chatName ${socketID}' style='cursor:pointer;font-weight:1000;color:#${getColor(name)}'><i class='fas fa-crown'></i> ${name}</span> : <span class='${type}Chat'>${text}</span>`)
          
          
          
  
  
        }else{
          chatAppend("chat", `<span data-toggle="popover" data-placement="bottom"  data-html="true" data-sname='${name}' data-sid='${socketID}'
                              class='chatName ${socketID} ${type}Name' style='cursor:pointer;font-weight:1000;color:#${getColor(name)}'>${name}</span> : <span class='${type}Chat'>${text}</span>`)
          
        
        }

        if(currentName != name && !isFocus && !info[roomName].isPlaying){
          Push.create(name, {
            body: text,
            icon: '/images/icon_player.png',
            timeout: 3000,
            onClick: function () {
                window.focus();
                this.close();
            }
          });
          var audio = document.getElementById('audio_play'); 
          if (audio.paused) { 
              audio.play(); 
          }else{ 
              audio.pause(); 
              audio.currentTime = 0 
              audio.play(); 
          } 

          
        }


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
  
        var a = $('#currentName').text().trim();
        var b = $('#inputName').val()
  
        socket.emit('changeName', a, b)
        
      })
     
  
  
      

      socket.on('joinRoom', function(roomName, name, socketID, me){
        if (me){
          $('#chatting').html('');
        }
        
        chatAppend("noticePrimary", `<span data-sname='${name}' data-sid='${socketID}' class='chatName ${socketID}' style='font-weight:1000;color:#${getColor(name)}'>${name}</span>님이 ${roomName}에 입장함 ㅋ`)
        currentRoom = roomName;
        
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
  
        
      })
        
      socket.on('leaveRoom', function(roomName, name, socketID, me){
        console.log(roomName, name, me);
        chatAppend("noticeDanger", `<span data-sname='${name}' data-sid='${socketID}' class='chatName ${socketID}' style='font-weight:1000;color:#${getColor(name)}'>${name}</span>님이 ${roomName}을 나감 ㅋ`)
        if(me){
          currentRoom = undefined;
        }
        
        if(!currentRoom){
          $('#chatContainer').css('visibility', 'hidden');
          $('#exitRoom').css('visibility', 'hidden');
        }else{
          $('#chatContainer').css('visibility', 'visible');
          $('#exitRoom').css('visibility', 'visible');
        }
  
        namePopover(roomName);
      })
        
      socket.on('kickedRoom', function(roomName, name, socketID, me){
        console.log(roomName, name, me);
        chatAppend("noticeDanger", `<span data-sname='${name}' data-sid='${socketID}' class='chatName ${socketID}' style='font-weight:1000;color:#${getColor(name)}'>${name}</span>님이 강퇴당함 ㅋㅋㅋㅋㅋㅋㅋ`)
        if(me){
          currentRoom = undefined;
          Swal.fire({
            icon: 'error',
            title: 'ㅋㅋㅋㅋㅋㅋㅋ',
            text: '강퇴 당함 ㅋ'
          })
        }
        
        if(!currentRoom){
          $('#chatContainer').css('visibility', 'hidden');
          $('#exitRoom').css('visibility', 'hidden');
        }else{
          $('#chatContainer').css('visibility', 'visible');
          $('#exitRoom').css('visibility', 'visible');
        }
        namePopover(roomName);
      })
        
  
  
  
      socket.on('failSetName', function(){
        alert("이미 있는 이름임ㅋ");
      })
  
      socket.on('successSetName', function(){
        $('#currentName').text($('#inputName').val())
        currentName = $('#inputName').val()
      })
  
      
  
  
      socket.on('refreshMain', function(data){
        info = data;
        $('[data-toggle="tooltip"]').tooltip('hide')
        console.log(data);
        var string = "<hr>";
        for (key in data){
          if(data[key].isPlaying) continue;
  
  
          let popup = "";
          popup += `<span style='color:red !important'>${key}</span><hr class='tooltipHR' style='background-color:red'>`
          //popup += "접속자 : " + data[key]["members"].length + "명";
          for (i in data[key]["members"]){
            if (i == 0){
              popup += "<span> <i class='fas fa-crown'></i> " + data[key]["members"][i] + "</span>"
            }else{
              popup += "<br> <span>" + data[key]["members"][i] + "</span>"
            }
           
          }
  
          if(data[key]["members"].includes(getMyName())){
            string += `
            <div class='room alert alert-warning d-flex justify-content-between '
            data-toggle='tooltip' data-placement='bottom' data-html='true' title="${popup}"> 
              <div class='roomName' style="display: block;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">${key}</div>
              <div class='roomLimit '>(${data[key].members.length}/${data[key].limit})</div>
            </div>`
          }else{
            string += `
            <div class='room alert alert-info d-flex justify-content-between '
            data-toggle='tooltip' data-placement='bottom' data-html='true' title="${popup}"> 
              <div class='roomName' style="display: block;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;">${key}</div>
              <div class='roomLimit '>(${data[key].members.length}/${data[key].limit})</div>
            </div>`
          }
  
          string += "<hr>"
        }
        $('#roomContainer').html(string);
  
        
        
        $('[data-toggle="tooltip"]').tooltip()
        $("#roomContainer").css("height", (parseFloat($("#leftContainer").css("height")) -  parseFloat($("#exitRoom").css("height")) -  parseFloat($("#upperRoomContainer").css("height"))) + "px")
      })
  
      
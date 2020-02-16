const socket = io();

function updateScroll(){
    var element = document.getElementById("chat-messages");
    element.scrollTop = element.scrollHeight;
}

socket.on('connect', function(){
    socket.emit('joinRoom')
})

socket.on('updateChat', function (username, data) {
    if(username=='SERVER'){
        $('#chat-messages').append($('<li class="green-text center "><b>'+username + ':</b> ' + data + '<br></br>'));
    }
    else{
        $('#chat-messages').append($('<li><b>'+username + ':</b> ' + data + '<br></br>'));
    }
    updateScroll()
});

socket.on('newMessagesRoom', function(aux, rooms, current_room){
    document.getElementById(aux).className = "collection-item white-text active orange accent-4";
})

socket.on('updateRooms', function(rooms, current_room) {
    $('#rooms').empty();
    $.each(rooms, function(key, value) {
        if(value == current_room){
            $('#rooms').append('<li id="'+value+'"class="collection-item active green accent-4">' + value);
            $('#salaActual').html('Sala '+value)
        }
        else {
            $('#rooms').append('<li id="'+value+ '"class="collection-item"><a class="green-text" href="#" onclick="switchRoom(\''+value+'\')">' + value);
        }
    });
});

function switchRoom(room){
    socket.emit('switchRoom', room);
}

$(function(){
    // when the client clicks SEND
    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendChat', message);
    });

    // when the client hits ENTER on their keyboard
    $('#data').keypress(function(e) {
        if(e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
});

var updateNewMesageList = setInterval(function(){
    socket.emit('updateRoomMessajes')
}, 5000)

/*$('form').submit(function() {
    const name = $('#name').val();
    const message = $('#message').val();

    socket.emit('chatter', `${name} : ${message}`);
    $('#message').val('');
    return false; 
});

socket.on('chatter', function(message) {
    $('#chat-messages').append($('<li>').text(message));
});*/
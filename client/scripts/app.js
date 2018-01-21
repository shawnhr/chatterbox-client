// YOUR CODE HERE:
console.log('you are in app.js');
var app = {
  // define server
  // rooms array?
  server: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
  username: 'shawn',
  roomname: 'first room',

  init: function() {
    // listen for submit button click
    $('#send .submit').on('click', function(event) {
      event.preventDefault();
      var text = $('#message').val();
      console.log(text);
      // send text from message to text
      app.handleSubmit(text);
    });

    // add text
    // add username

    // roomname
  },
  send: function(message) {
    console.log('send', message);
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      contenType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Message sent');
      },
      error: function(data) {
        console.log('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: app.server,
      //data: data, // JSON.stringify(message),
      type: 'GET',
      contenType: 'application/json',
      success: function(data) {
        console.log('chatterbox:', data);
        data = data;
      },
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  clearMessages: function() {
    $('#chats').remove();
  },
  renderMessage: function(message) {
    // loop through data
    // append each object to the #chats

    // jquery for append
     debugger;
    $('#chats').prepend(
      '<div class="chat">' + message.username + ' ' + message.text + ' ' + message.roomname + '</div>'
    );
  },
  renderRoom: function(roomName) {
    console.log('renderRoom', roomName);

    $('#roomSelect').prepend('<option>' + roomName + '</option>');
  },

  // <option value=''>name</option>
  handleUsernameClick: function() {
    // when the user clicks on the usernmae of a message
    // then fetch with a filter ?where={"username":"username”}
    // then Display all messages sent by friends in bold
  },
  // send in text from the form
  handleSubmit: function(text) {
    // set up the message for sending
    var message = {
      username: app.username,
      roomname: app.roomname,
      text: text
    };
    // send message
    app.send(message);
  }
};

$(document).ready(function() {
  app.init();
});

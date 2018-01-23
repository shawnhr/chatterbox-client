// YOUR CODE HERE:
console.log('you are in app.js');
var app = {
  // define server
  // rooms array?
  server: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
  username: window.location.search.substr(window.location.search.lastIndexOf('=') + 1),
  roomname: 'lobby',
  rooms: [],

  init: function() {
    // listen for submit button click
    $('#send .submit').on('click', function(event) {
      event.preventDefault();
      var text = $('#message').val();
      // send text from message to text
      app.handleSubmit(text);
    });

    // add click handler for #roomSelect
    $('#roomSelect').on('change', function(event) {
      console.log($(this).val());
    });

    // add an click handler for .username
    $('#chats').on('click', '.username', function(event) {
      console.log($(this).text());
      app.handleUsernameClick($(this).text());
    });
    // add text
    // add username
    // roomname
  },
  send: function(message) {
    app.renderMessage(message);
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      contenType: 'application/json',
      success: function(data) {},
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
      data: {
        order: '-createdAt',
        limit: 2000
        // where: { roomname: app.roomname }
      },
      contenType: 'application/json',
      success: function(data) {
        // create a var to hold the results
        var results = data.results;
        //if roomname not in rooms[];
        //
        // push room to rooms[]
        //  call renderRoom fx with room

        results.forEach(function(ele) {
          if (!app.rooms.includes(ele.roomname)) {
            app.renderRoom(ele.roomname);
            app.rooms.push(ele.roomname);
          }
          app.renderMessage(ele);
        });

        // loop over the results and use the renderMessage fx
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
    $('#chats').append(
      '<div class="chat" data=' +
        message.createdAt +
        '><span class="username">' +
        app.xssPrevention(message.username) +
        '</span> ' +
        app.xssPrevention(message.text) +
        ' ' +
        app.xssPrevention(message.roomname) +
        '</div>'
    );
  },
  renderRoom: function(roomName) {
    $('#roomSelect').append(
      '<option value="' + app.xssPrevention(roomName) + '">' + app.xssPrevention(roomName) + '</option>'
    );
  },

  // <option value=''>name</option>
  handleUsernameClick: function(event) {
    // when the user clicks on the usernmae of a message
    // then fetch with a filter ?where={"username":"username”}
    // then Display all messages sent by friends in bold
    console.log('username:', event);
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
  },

  xssPrevention: function(value) {
    return encodeURIComponent(value).replace(/%20/g, ' ');
  }
};

$(document).ready(function() {
  app.init();
  app.fetch();
});

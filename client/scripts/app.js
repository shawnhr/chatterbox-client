// YOUR CODE HERE:
var app = {
  server: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages',
  username: window.location.search.substr(window.location.search.lastIndexOf('=') + 1),
  roomname: 'lobby',
  rooms: [],
  messages: [],

  init: function() {
    $('#send .submit').on('click', function() {
      event.preventDefault();
      app.handleSubmit();
    });

    $('#roomSelect').on('change', function(event) {
      app.handleRoomSelect(event);
    });

    $('#chats').on('click', '.username', function(event) {
      app.handleUsernameClick($(this).text());
    });
  },
  send: function(message) {
    //app.renderMessage(message);
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      //contenType: 'application/json',
      success: function(data) {
        app.clearMessages();
        app.fetch();
        // app.handleRoomSelect(app.roomname);
      },
      error: function(error) {
        console.log('chatterbox: Failed to send message', error);
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 30
        // where: {
        //   username: {
        //     $nin: ['anonymous', 'undefined']
        //   }
        // }
      },
      contentType: 'application/json',
      success: function(data) {
        var results = data.results;
        app.messages = results;
        results.forEach(function(ele) {
          if (!app.rooms.includes(ele.roomname)) {
            app.renderRoom(ele.roomname);
            app.rooms.push(ele.roomname);
          }
          app.renderMessage(ele);
        });
      },
      error: function(error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  renderMessage: function(message) {
    $('#chats').append(
      '<div class="chat" data=' +
        message.createdAt +
        '><span class="username ' +
        app.xssPrevention(message.username).replace(' ', '_') +
        '">' +
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

  handleUsernameClick: function(event) {
    // when the user clicks on the usernmae of a message
    // then fetch with a filter ?where={"username":"username”}
    // then Display all messages sent by friends in bold

    var currentFriend = event;
    currentFriend = '.' + currentFriend.replace(' ', '_');
    $(currentFriend)
      .closest('div')
      .toggleClass('friend');
  },
  handleSubmit: function() {
    var message = {
      username: app.username,
      roomname: app.roomname || 'lobby',
      text: $('#message').val()
    };
    app.send(message);
    $('#message').val('');
    // send message
  },

  handleRoomSelect: function(event) {
    var selected = $('#roomSelect').prop('selectedIndex');
    if (!selected) {
      newRoom = prompt('Create a new room');
      newUser = prompt('Enter user name');
      app.roomname = newRoom;
      app.username = newUser;
      //app.renderRoom(newRoom);
      $('#roomSelect').val(newRoom);
    } else {
      app.roomname = $('#roomSelect').val();
      app.clearMessages();
      var filtered = app.messages.filter(function(m) {
        return app.roomname === m.roomname;
      });
      for (var el of filtered) {
        app.renderMessage(el);
      }
    }
  },

  xssPrevention: function(value) {
    return encodeURIComponent(value).replace(/%20/g, ' ');
  }
};

$(document).ready(function() {
  app.init();
  app.fetch();
});

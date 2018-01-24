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
      error: function(data) {
        console.log('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {
        order: '-createdAt',
        limit: 6
        // where: {
        //   username: {
        //     $nin: ['anonymous', 'undefined']
        //   }
        // }
      },
      contenType: 'application/json',
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
      error: function(data) {
        console.error('chatterbox: Failed to send message', data);
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
        app.xssPrevention(message.username) +
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
    currentFriend = '.' + currentFriend;
    $(currentFriend)
      .closest('div')
      .addClass('friend');
  },
  handleSubmit: function() {
    var message = {
      username: app.username,
      roomname: app.roomname || 'lobby',
      text: $('#message').val()
    };
    $('#message').val('');
    // send message
    app.send(message);
  },

  handleRoomSelect: function(event) {
    var selected = $('#roomSelect').prop('selectedIndex');
    if (!selected) {
      newRoom = prompt('Create a new room');

      app.roomname = newRoom;
      app.renderRoom(newRoom);
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

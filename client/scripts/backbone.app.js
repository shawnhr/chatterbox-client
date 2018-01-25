console.log('backbone.app.js');
debugger;
var AppRouter = Backbone.Router.extend({
  routes: {
    '*other': 'loadChats'
  },

  loadChats: function() {
    console.log('hello');
  },

  init: function() {
    console.log('is this on');
  }
});

var Chat = Backbone.Model.extend({
  intitialize: function() {
    this.model.on('change', this.onModelChange, this);
  },

  onModelChange: function() {
    console.log('friend');
    this.$el.addClass('friend');
  },

  defaults: {
    username: 'annonymous',
    txt: 'nothing to see here',
    roomname: 'lobby'
  }
});

var Chats = Backbone.Collection.extend({
  model: Chat,

  byUser: function(username) {
    filtered = this.filter(function(chat) {
      return chat.get('username') === username;
    });

    return new Chats(filtered);
  },

  parse: function(response) {
    return response.results;
  },
  url: 'http://parse.rpt.hackreactor.com/chatterbox/classes/messages'
});

var ChatView = Backbone.View.extend({
  // tagName: 'span',
  // className: 'chat',
  render: function() {
    // this.$el.html(this.model.get('username'));
    var template = _.template($('#chatTemplate').html());
    var html = template(this.model.toJSON());
    this.$el.html(html);

    return this;
  }
});

var ChatsView = Backbone.View.extend({
  tagName: 'span',
  className: 'chat',

  render: function() {
    //this.$el.html('loading');
    var self = this;
    this.model.each(function(chat) {
      var chatView = new ChatView({ model: chat });
      self.$el.append(chatView.render().$el);
    });
  }
});

var chats = new Chats();
var promise = chats.fetch();
var chatsView = new ChatsView({ el: '#chats', model: chats });

promise.done(function() {
  chatsView.render();
});

// var chatsView = new ChatsView({ el: '#main', model: chats });
// chatsView.render();
// $('#main').html(chatView.render().$el);
$(document).ready(function() {});

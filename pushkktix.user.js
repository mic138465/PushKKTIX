// ==UserScript==
// @name        PushKKTIX
// @namespace   pushkktix
// @description 推倒 KKTIX
// @include     https://kktix.com/events/*/registrations/new
// @version     1
// @grant       none
// ==/UserScript==

var eventid = window.location.href.match(/kktix.com\/events\/([^\/]+)\//)[1];
var ticketid;
var quantity;

var go = function() {
  $.getJSON('/g/events/' + eventid + '/base_info', function(data) {
    var tickets = data.eventData.tickets;
    for(i in tickets) {
      showBtn(tickets[i].id, tickets[i].name, tickets[i].max_to_buy);
    }

    $('.pushkktix').click(function() {
      $(this).html('正在推倒' + $(this).attr('data-ticketname') + '...');
      $('.pushkktix').attr('disabled', 'disabled');
      $('.pushkktix').addClass('btn-disabled-alt');
      ticketid = $(this).attr('data-ticketid');
      quantity = $('#ticket_' + ticketid + ' .ticket-select select').val();
      pushDown();
    });
  });
}
  
var showBtn = function(ticketid, name, max_to_buy) {
  $("#ticket_" + ticketid + " .ticket-title").html('<button data-ticketid="' + ticketid + '" data-ticketname="' + name + '" class="pushkktix btn btn-primary">推倒 ' + name + '</button>');

  shtml = '<select type="number">';
  for(i = 0; i <= max_to_buy; i++)
    shtml += '<option value="' + i + '">' + i + '</option>';
  shtml += '</select>';
  
  $('#ticket_' + ticketid + ' .ticket-select').html(shtml);
}

var pushDown = function() {
//{"tickets":[{"id":29100,"quantity":1,"invitationCodes":[]}],"currency":"TWD","recaptcha":{},"agreeTerm":true}
  $.post('/g/events/' + eventid + '/registrations',
         '{"tickets":[{"id":' + ticketid + ',' +
          '"quantity":' + quantity + ','+
          '"invitationCodes":[]}],'+
          '"currency":"TWD",'+
          '"recaptcha":{},'+
          '"agreeTerm":true}',
         function(data) {
    alert('媽！我搶到票了！');
    window.location.href = "/events/" + eventid + "/registrations/" + data.to_param
  }).fail(function() {
    pushDown();
  });

}

$(function() {
  $('#salutation').append('<a class="pushdownstart">推倒 KKTIX</a>');
  $('.pushdownstart').click(function() {
    go();
  });
})


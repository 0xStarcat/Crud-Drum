var clips_listeners;

$(document).ready(function()
{
  clips_listeners = new Clips_Listeners;
})

function Clips_Listeners()
{
  this.save_clip_button = $('#save_clip');
  this.save_clip_button.on('click', save_clip);
  $('.load_button').each(function(button)
    {
      $(this).on('click', load_clip);
    });
};

var save_clip = function()
{
  var user_id = document.querySelector('.user_id').getAttribute('user');

  var data = {user_id: user_id, coords: JSON.stringify(current_pattern.pattern)};
  console.log("SAVE DATA", data);
  //grab user id first
  //then return ajax with data
  ajax_this('/clips', 'POST', data, success, error_function)
  function success(data)
  {
    clips_listeners = new Clips_Listeners;
  }
};

var load_clip = function(e)
{

  var id = e.target.getAttribute('clip');
  console.log("get clip id:", id)
  ajax_this('/clip_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    console.log("CLIP LOADED FROM SERVEr");
    var coords = JSON.parse(data.coords);
    loadPattern(data);
  }
};

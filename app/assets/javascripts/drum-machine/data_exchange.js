function Session_Data()
{
  this.user;
  this.editor_data;
  this.song_data;
}

var save_clip = function()
{
  disable_buttons();
  var user_id = document.querySelector('.user_id').getAttribute('user');

  var data = {user_id: parseInt(user_id), coords: JSON.stringify(clip_editor.pattern)};
  console.log("SAVE DATA", data);

  ajax_this('/clips', 'POST', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();
  }
};

var save_song = function()
{
  disable_buttons();
  var user_id = document.querySelector('.user_id').getAttribute('user');

  var data = {user_id: parseInt(user_id), data: JSON.stringify(song.clips)};
  console.log("SAVE SONG", data);

  ajax_this('/songs', 'POST', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();
  }
}

var load_clip = function(e, clip, canvas)
{
  disable_buttons();
  console.log("LOADING clip", clip, " to ", canvas);
  var id = clip;

  ajax_this('/clip_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    stop();
    console.log("CLIP LOADED FROM SERVER", data);
    var pattern = JSON.parse(data.coords);
    session.editor_data = data;
    loadPattern(pattern, canvas);
    enable_buttons();
  }
};

var load_song = function(e)
{

  disable_buttons();
  var id = e.target.getAttribute('song');
  console.log("get song id:", id)
  ajax_this('/song_req', 'GET', {id: id}, success, error_function)
  function success(data)
  {
    stop();
    console.log("SONG LOADED", data);
    var load_song = JSON.parse(data.song_data);
    session.song_data = data;
    render_song(load_song);
    enable_buttons();
  }
}

var update_clip = function()
{
  disable_buttons();
  var clip_id = session.editor_data.id;
  var user_id = session.editor_data.user_id;
  var name = session.editor_data.name;
  var data = {id: parseInt(clip_id), user_id: parseInt(user_id), name: name, coords: JSON.stringify(clip_editor.pattern)};
  console.log("UPDATE DATA", data);
  session.editor_data = data;
  ajax_this('/clips/'+clip_id, 'PATCH', data, success, error_function)

  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();
  }
}

var update_song = function()
{
  disable_buttons();
  var song_id = session.song_data.id;
  var user_id = session.song_data.user_id;
  var name = session.song_data.name;

  var data = {id: parseInt(song_id), user_id: parseInt(user_id), name: name, data: JSON.stringify(song.clips)};
  session.song_data = data;
  console.log("UPDATE SONG", data);

  ajax_this('/songs/'+song_id, 'PATCH', data, success, error_function)
  function success(data)
  {
    library_listeners = new Library_Listeners;
    enable_buttons();

  }
}

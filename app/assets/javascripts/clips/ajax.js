function ajax_this(url, method, data, success, error){

  $.ajax({
    url: url,
    method: method,
    data: data,
    success: function(data)
    {
      success(data);
    },
    error: function(data)
    {
      error(url, method, data);
    }
  })
}

var error_function = function(url, method, data)
{
  console.log("********ERROR********", url, method, data)
  toggleMenu();
  showMenu();
  $('#preloader').css('display', 'none')
  $('#textFlash1').text('Sorry, Google wouldn\'t share with us. Try again!')
  home_map.circle.setOptions({fillColor: '#FF0000', draggable: true});

}

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
      enable_buttons();
      error(url, method, data);

    }
  })
}

var error_function = function(url, method, data)
{
  console.log("********ERROR********", url, method, data)



}

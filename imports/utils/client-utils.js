
Array.prototype._remove_ = function(value) {
  var idx = this.indexOf(value);
  if (idx != -1) {
      return this.splice(idx, 1);
  }
  return false;
}


export const ClientUtils = {
  getUrlParams: function (url, options, callback) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
};


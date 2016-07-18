define(function (require) {
	function Utilities() {}

	Utilities.getUID = function() {
      function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return 'a' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
    return Utilities;
});
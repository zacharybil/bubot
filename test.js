var http = require('http');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	console.log("State: " + this.readyState);
	
	if (this.readyState === 4) {
		console.log("Complete.\nBody length: " + this.responseText.length);
        console.log
        var result = JSON.parse(this.responseText);
        console.log(result.data[0].images.fixed_height.url);
	}
};

xhr.open("GET", "http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC&limit=1");
xhr.send();

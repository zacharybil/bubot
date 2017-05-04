var Discordie = require('discordie');
var http = require('http');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const Events = Discordie.Events;
const client = new Discordie();

client.connect({
    token: 'MzA4OTI1NDQ1NDIyNzEwNzg0.C-n8yg.R3tQ9REw4fp3RIJJjRzB4OYUCVg'
})

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log('Connected as: ' + client.User.username);
});

var giphyThis = (query, discordEvent, outputMethod, limit) => {
    if (!limit) limit = 1;
    console.log('giphying ' + query);
    
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {        
        if (this.readyState === 4) {            
            outputMethod(this.responseText, discordEvent, limit);            
        }
    };
    
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + query + '&api_key=dc6zaTOxFJmzC&limit=' + limit;
    console.log(url);
    xhr.open('GET', url);
    xhr.send();
}

var oneGiphy = (response, discordEvent) => {
    var result = JSON.parse(response);
    var random = getRandomInt(0, result.data.length-1);
    console.log('oneGiphy result: ' + result.data[random].images.fixed_height.url);
    discordEvent.message.channel.sendMessage(result.data[random].images.fixed_height.url);    
}

var giphyBomb = (response, discordEvent, bombCount) => {
    var result = JSON.parse(response);
    for (var i = 0; i<Math.min(bombCount, result.data.length); i++) {
        console.log('bomb ' + i + ' ' + result.data[i].images.fixed_height.url);
        discordEvent.message.channel.sendMessage(result.data[i].images.fixed_height.url);         
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randomGreetings = ['yo', 'hi', 'hi there', 'what up homie', 'hey dood', 'hey man', 'greetings'];

client.Dispatcher.on(Events.MESSAGE_CREATE, discordEvent => {
    // This is the bots id, should find a better way to check this.
    if (discordEvent.message.author == '308925445422710784') return;
    console.log(discordEvent.message.author + ': ' + discordEvent.message.content);
    if (discordEvent.message.content == 'bubot' ||
        discordEvent.message.content == 'yo' ||
        discordEvent.message.content == 'hey' ||
        discordEvent.message.content == 'what up' ||
        discordEvent.message.content == 'hi' ||
        discordEvent.message.content == 'hello') {
        var random = getRandomInt(0, randomGreetings.length-1);
        discordEvent.message.channel.sendMessage(randomGreetings[random]);
        } 
    if (discordEvent.message.content == 'bubot help') {
        discordEvent.message.channel.sendMessage('use "bubot gifme cats" or "bubot gifbomb cats 3"');
    }
    if (discordEvent.message.content == 'reuben') {
        discordEvent.message.channel.sendMessage('is fab');
    }
    if (discordEvent.message.content == 'zac') {
        discordEvent.message.channel.sendMessage('is awesome');
    }
    if (discordEvent.message.content.startsWith('bubot gifme ')) {
        var query = discordEvent.message.content;
        query = query.replace(/bubot gifme /g, '');
        query = query.replace(/ /g, '+');
        console.log(oneGiphy);
        giphyThis(query, discordEvent, oneGiphy, 20);
    }
    if (discordEvent.message.content.startsWith('bubot gifbomb ')) {
        var query = discordEvent.message.content;
        var split = query.split(' ');
        query = query.replace(/bubot gifbomb /g, '');
        query = query.replace(/ /g, '+');
        
        var bombCount = split[split.length-1];
        if (!Number.isInteger(Number(bombCount))) bombCount = 3;
        else {
            query = query.substring(0, query.length - bombCount.length)
        }
        if (bombCount > 30) bombCount = 30;
        giphyThis(query, discordEvent, giphyBomb, bombCount);        
    }
});

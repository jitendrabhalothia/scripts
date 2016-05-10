module.exports.concat = function(payload) {
  //console.log(payload);

  var message = [];
  for(var i=0;i<payload.length;i++) {
    //console.log(payload[i]);

    message.push(sails.config.message[payload[i]]);
  }

  return message;
  //return "Cleared the message Handler";


};
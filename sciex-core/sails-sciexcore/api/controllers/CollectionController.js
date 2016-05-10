/*
* CollectionController.js
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  //Creates Collection details
  // create: function(req, res, next, callback) {
  //   var params = req.body,
  //       messageArray = [],
  //       message;

  //   Collection.create(params, function(err, data) {
  //     var error = JSON.parse(JSON.stringify(err));
  //     if (err) {
  //       if (callback != undefined) {
  //           if (error.error == sails.config.validationMessage.E_VALIDATION) {
  //               messageArray.push("4000");
  //               message = MessageHandler.concat(messageArray);
  //               message[0].short_message = error.summary + " " + Object.keys(error.invalidAttributes);
  //               message[0].context = req.route.path;             
  //               return callback({
  //                   message : message
  //               }, null);

  //           }
  //           if (error.error == sails.config.validationMessage.E_UNKNOWN) {
  //               messageArray.push("4000");
  //               message = MessageHandler.concat(messageArray);
  //               message[0].short_message = error.summary;
  //               message[0].context = req.route.path;
  //               return callback({
  //                   message : message
  //               }, null);
  //           }
  //       } else {
  //           if (error.error == sails.config.validationMessage.E_VALIDATION) {
  //               messageArray.push("4000");
  //               message = MessageHandler.concat(messageArray);
  //               message[0].short_message = error.summary + " " + Object.keys(error.invalidAttributes);
  //               message[0].context = req.route.path;
  //               return res.badRequest({
  //                   message : message
  //               });

  //           }
  //           if (error.error == sails.config.validationMessage.E_UNKNOWN) {
  //               messageArray.push("4000");
  //               message = MessageHandler.concat(messageArray);
  //               message[0].short_message = error.summary;
  //               message[0].context = req.route.path;
  //               return res.badRequest({
  //                   message : message
  //               });
  //           } else {
  //               return res.json(err);
  //           }
  //       }
  //     } else {
  //       req.params.objectType = sails.config.objectType.CollectionObjectType;
  //       sails.controllers.auditlog.create(req, res, next, data);
  //       if (callback != undefined) {
  //           return callback(null, data);
  //       }
  //       return res.json(data);
  //     }
  //   });
  // },
  create: function(req, res, next, callback) {
     var params = req.body,
         messageArray = [],
         message;

     Collection.create(params, function(err, data) {
         if (err) {
             var error = JSON.parse(JSON.stringify(err));
             messageArray.push("4000");
             message = MessageHandler.concat(messageArray);
             message[0].short_message = error.summary

             var expectedErrorCode = false;
             
             if (error.error == sails.config.validationMessage.E_VALIDATION) {
                 expectedErrorCode = true;
                 message[0].short_message +=  " " + Object.keys(error.invalidAttributes);
             } else if (error.error == sails.config.validationMessage.E_UNKNOWN) {
                 expectedErrorCode = true;
             }

             message[0].context = req.route.path;

             if (callback != undefined) {
                 return callback({
                     message: message
                 }, null);
             } else if (expectedErrorCode){
                 res.badRequest({
                     message: message
                 });
             } else {
                 return res.json(err);
             }
         }
         req.params.objectType = sails.config.objectType.CollectionObjectType;
         sails.controllers.auditlog.create(req, res, next, data);
         if (callback != undefined) {
             return callback(null, data);
         }
         return res.json(data);
     });
  },

  //Update by name
  update: function(req, res, next, callback) {
    var params = req.params.all(),
        name = params.name,
        messageArray = [],
        message;

    if (!name) {
        messageArray.push("2100");
        message = MessageHandler.concat(messageArray);
        message[0].context = req.route.path;
        return res.badRequest({
            message : message
        });

    } else {

      Collection.update({name:name}, params, function(err, data) {
        var error = JSON.parse(JSON.stringify(err));
        if (err) {
            if (callback != undefined) {
                return callback(err, null);
            } else {
                if (error.error == sails.config.validationMessage.E_UNKNOWN) {
                    messageArray.push("2101");
                    message = MessageHandler.concat(messageArray);
                    message[0].short_message = error.summary;
                    message[0].context = req.route.path;
                    return res.badRequest({
                        message : message
                    });
                } else {
                    return res.json(err);
                }
            }
        }
        if (data.length) {
            sails.controllers.auditlog.update(req, res, next, data);
            if (callback != undefined) {
                return callback(null, data);
            }
            return res.json(data);
        } else {
            messageArray.push("2101");
            message = MessageHandler.concat(messageArray);
            message[0].context = req.route.path;
            return res.badRequest({
                message : message
            });
        }
      });
    }
  },

  //Delete by name. It is only soft delete. Update logicalDelete to true
  delete: function(req, res, next, callback) {
    var params = req.params.all(),
        name = params.name,
        messageArray = [],
        message; 

    params.logicalDelete = true;

    if (!name) {
        messageArray.push("2100");
        message = MessageHandler.concat(messageArray);
        message[0].context = req.route.path;
        return res.badRequest({
            message : message
        });
    } else {
      sails.controllers.collection.update(req, res, next, function(err, data) {
        if (err) {
            if (callback != undefined)
                return callback(err, null);
            return res.json(err);
        }

        if (data.length) {
            sails.controllers.auditlog.delete(req, res, next, data[0]);
            if (callback != undefined) {
                return callback(null, data);
            }
            return res.json(data);
        } else {
            messageArray.push("2102");
            message = MessageHandler.concat(messageArray);
            message[0].context = req.route.path;
            return res.badRequest({
                message : message
            });
        }
      });
    }
  },
  
  //Find by name
  findbyName: function(req, res, next, callback) {
    var params = req.params.all(),
        messageArray = [],
        message,
        query = {
          logicalDelete: false
        };

    if (params.name) {
    query['name'] = params.name;
    } else {
        messageArray.push("2100");
        message = MessageHandler.concat(messageArray);
        message[0].context = req.route.path;
        return res.badRequest({
            message : message
        });
    }

    if (query) {
      Collection.find(query).exec(function(err, data) {
        if (err) {
            if (callback != undefined)
                return callback(err, null);
            return res.json(err);
        }

        if (data.length) {
            if (callback != undefined) {
                return callback(null, data);
            }
            return res.json(data);
        } else {
            if (callback != undefined) {
                return callback(null, data);
            } else {
                messageArray.push("2103");
                message = MessageHandler.concat(messageArray);
                return res.badRequest({
                    message : message
                });
            }
        }
      });
    }
  },

  find: function(req, res, next, callback) {
    var params = req.params.all(),
        messageArray = [],
        message,
        query = {
          logicalDelete: false,
          tenantId: sails.config.global.TENANT_ID
        };
    if (query) {
      Collection.find(query).exec(function(err, data) {
        if (err) {
            if (callback != undefined)
                return callback(err, null);
            return res.json(err);
        }

        if (data.length) {
            if (callback != undefined) {
                return callback(null, data);
            }
            return res.json(data);
        } else {
            if (callback != undefined) {
                return callback(null, data);
            } else {
                messageArray.push("2104");
                message = MessageHandler.concat(messageArray);
                return res.badRequest({
                    message : message
                });
            }
        }
      });
    }
  },

  add : function (req, res, next, callback) {
    var params = req.params.all();
    sails.controllers.collection.findbyName(req, res, next, function(err, data){
      if(data.length){
        if(params.element && params.element.length){
          var el = params.element;
          for(var i = 0; i < el.length; i+=1){
            console.log('element', data[0]['element']);
            if(data[0]['homogeneous']){
              if(data[0]['type'] != el[i]['objectType']){
                return res.badRequest('{"error":"error"}')
                break;
              } else {
                if(i+1 == el.length){
                 console.log('every thing same type');
                }
              }
            }
          }
        } else {
          console.log('empty element');
        }
        return res.json(data);
      } else {
        return res.badRequest('{"error":"error"}');
      }
    });
  },

  remove : function  (req, res, next, callback) {

    var params = req.params.all();
    sails.controllers.collection.findbyName(req,res,next,function(err,data){
      if(err){
        return res.badRequest('{"error":"error"}');
      }
      else{
        if(data.length){
          console.log(data);
        }
        else{
          return res.badRequest('no collection found with the given name');
        }
      }
    });
  },

  findElement : function (req, res, next, callback) {
    var params = req.params.all(),
        messageArray = [],
        message;
    sails.controllers.collection.findbyName(req, res, next,function(err,data){
      if(!err){
        if(data.length){
          var n = 0,
              element = data[0]['element'];
         
         findElementId(element[n]);
         function findElementId (result){
          if(n < data.length){
            if(params.id === result.id){
              res.json({
                data : result,
                message : "The element belongs to the group"
              })
            } else {
              n++;
              findElementId(element[n]);
            }
          } else {
            messageArray.push('2104');
            message = MessageHandler.concat(messageArray);
            message[0].context = req.route.path;   
                return res.badRequest({message : message});
            }
         }
       }
      else { 
         messageArray.push('2103');
         message = MessageHandler.concat(messageArray);
         message[0].context = req.route.path;
           return res.badRequest({message : message});
      }
    }
      else { 
        res.json(err);
      }
    });
  },

  size : function(req, res, next, callback){

  },

  findDuplicate : function(oldelementArray, newelementArray, callback){

  }


};


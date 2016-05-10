/*
* Collection.js
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var objectTypes = require('./neevObjectType.js')();

module.exports = {

  attributes: {

    //Unique ID
    tenantId : {
      type : 'string',
    },

    // name of the collection which is used during updation, deletion and find as key
    name : {
	    type : 'string',
      required : true,
      unique : true
    },

    //an array of objects where each object must have an id and its respective objectType
    element : {
	    type : 'json'
    },

    // the collection type is restricted to neev objectTypes
    type : {
      type : 'string',
      enum : objectTypes
    },

    //Indicates the collection type, by default collection is homogeneous
    homogeneous : {
      type : 'boolean',
      defaultsTo : true
    },

    // Logical Delete for soft delete
    logicalDelete : {
      type : 'boolean',
      defaultsTo : false,
      boolean : true
    }
    
  },

  beforeCreate: function(attrs, next) {
    attrs.tenantId = sails.config.global.TENANT_ID;
    //check for homogeneous
    if(attrs.homogeneous){
      //check for collection type
      if(!attrs.type){
        var err = {
          error: sails.config.validationMessage.E_UNKNOWN,
          summary: sails.config.customMessage.notype
        }
        return next(err);
      } else {
        if(attrs.element){
        var el = attrs.element;
        for(var index = 0; index < el.length; index+=1){
          if(el[index]['objectType'] != attrs.type){
            var err = {
              error: sails.config.validationMessage.E_UNKNOWN,
              summary: sails.config.customMessage.nosametype
            }
            return next(err);
            break;
          } else {
            if(index + 1 == el.length){
              next();
            }
          }
        }
    }
    else {
      next();
    }
  }
  } else {
      next(); // heterogeneous collection
  }

},

beforeUpdate : function (attrs, next) {
  next();
}
  
};


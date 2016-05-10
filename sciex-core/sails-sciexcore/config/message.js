module.exports = {  

    customMessage : {
        notype : 'No type provided for the collection since it is homogeneous collection',
        nosametype : 'The objectType of the element must be the same as collection type since it is homogeneous'
    },

    message: {

        //Error Message from mongoDb

        //S success, E for error, I for information, W for warning, 

        "4000" : {
            "code": "4000",
            "severity": "E",
            "short_message": "",
            "context": ""
        },

        "2100": {
            "code": "2100",
            "severity": "E",
            "short_message": "No name Provided",
            "context": ""
        },

        "2101": {
            "code": "2101",
            "severity": "E",
            "short_message": "No name present to update the data Provided",
            "context": ""
        },

        //updateByBusinessPartnerId
        "2102": {
            "code": "2102",
            "severity": "S",
            "short_message": "No name present to delete the data Provided",
            "context": ""
        },

        "2103": {
            "code": "2103",
            "severity": "S",
            "short_message": "No data was found for the given name",
            "context": ""
        },

        "2104": {
            "code": "2104",
            "severity": "S",
            "short_message": "No data was found",
            "context": ""
        }

    }
}
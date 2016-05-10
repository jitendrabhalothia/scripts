/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

var blueprintConfig = require('./blueprints');

var ROUTE_PREFIX = blueprintConfig.blueprints.prefix || "";

// add global prefix to manually defined routes
function addGlobalPrefix(routes) {
  var paths = Object.keys(routes),
      newRoutes = {};

  if(ROUTE_PREFIX === "") {
    return routes;
  }

  paths.forEach(function(path) {
    var pathParts = path.split(" "),
        uri = pathParts.pop(),
        prefixedURI = "", newPath = "";

      prefixedURI = ROUTE_PREFIX + uri;

      pathParts.push(prefixedURI);

      newPath = pathParts.join(" ");
      // construct the new routes
      newRoutes[newPath] = routes[path];
  });

  return newRoutes;
};

module.exports.routes = addGlobalPrefix({
  
  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

/********** Collections api routes *********************************/


  'POST /collections' : {
    controller: 'Collection',
    action: 'create'
  },

  'PUT /collections/:name' : {
    controller: 'Collection',
    action: 'update'
  },

  'DELETE /collections/:name' : {
    controller: 'Collection',
    action: 'delete'
  },

  'GET /collections' : {
    controller: 'Collection',
    action: 'find'
  },

  'GET /collections/:name' : {
    controller: 'Collection',
    action: 'findbyName'
  },

  'GET /collections/:name/size' : {
    controller: 'Collection',
    action: 'size'
  },

  'POST /collections/:name/add' : {
    controller: 'Collection',
    action: 'add'
  },

  'DELETE /collections/:name/remove' : {
    controller: 'Collection',
    action: 'remove'
  },

  'GET /collections/:name/find/:id' : {
    controller: 'Collection',
    action: 'findElement'
  }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

});

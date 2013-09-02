define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var FeatureHistoria = Backbone.Model.extend({

  defaults: {

    feature: {}
    ,date: {
      //ISO-8601 2013-07-31T19:28:10.444Z
      iso: 'YYYY-MM-DDTHH:mm:ss.sssZ'
      ,src: ''
    } 

  }
});

return FeatureHistoria;

});


define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

/*
 * Feature
 * list<Feature> http://www.geojson.org/geojson-spec.html
 */

function( $, _, Backbone ) 
{

'use strict';

var Feature = Backbone.Model.extend({

  defaults: {
    id: ''
    ,type: 'Feature'
    ,properties: {

      type: ''
      ,date: {
        //ISO-8601 2013-07-31T19:28:10.444Z
        iso: 'YYYY-MM-DDTHH:mm:ss.sssZ'
        ,src: ''
      } 
      ,descripcion: ''
      ,infowin: ''
    }

    ,geometry: {
      type: ''
      ,coordinates: []
    }

  }
});

//var FeatureCollection = Backbone.Model.extend({
  //defaults: {
    //id: ''
    //,type: 'FeatureCollection'
    //,features: [
      //{
        //type: 'Feature'
        //,properties: {
          //type: ''
          //,date: {
            ////ISO-8601 2013-07-31T19:28:10.444Z
            //iso: 'YYYY-MM-DDTHH:mm:ss.sssZ'
            //,src: ''
          //} 
          //,infowin: ''
        //}
        //,geometry: {
          //type: ''
          //,coordinates: []
        //}
      //}
    //]
  //}
//});

return Feature;

});


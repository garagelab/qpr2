define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Feature'
    ], 

function( $, _, Backbone, Feature ) 
{

'use strict';

function Historia( opt ) 
{
  _.extend( this, Backbone.Events );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  this.filters = function() { return ''; }

  var _db = [
    'ROWID'
    ,'hid'
    ,'tipo'
    ,'link_id'
    ,'fecha'
  ];

  //this._geocoder = new google.maps.Geocoder();
}

Historia.prototype.parse =
function( data, sync_opt )
{
  //console.log('ft historia parse',arguments)

  var db = this.db();
  var i, idx, hdata;

  var rows = data.rows;

  _.each( rows, function( row ) 
  {

    hdata = {};
    i = db.length;
    while( i-- ) 
    {
      idx = db.indexOf( db[i] );
      hdata[ db[i] ] = row[ idx ];
    }

    this.trigger( 'add:historia', hdata );

    //this._geocoder.geocode( 
    //{ 
      //'address': address
    //}, 
    //(function() {
      //var _hid = hid + '';
      //return function( r, st ) 
      //{
        //if ( st !== 
          //google.maps.GeocoderStatus.OK ) {
          //console.error( "Geocode was not successful for the following reason: " + st); 
          //return;
        //}
        //var coord = r[0].geometry.location;
        //var latlng = [];
        //var n = 0;
        //for ( var k in coord )
        //{
          //latlng[n] = coord[k];
          //n++;
        //}

        //this.trigger('add:feature',
        //new Feature({ 
          //id: _hid
          //,properties: {
            //id: _hid
            //,type: opt.name
            //,titulo: _titulo
            //,resumen: _resumen
            //,descripcion: _descripcion
            //,icon: opt.icon
          //}
          //,geometry: {
            //type: 'Point'
            //,coordinates: [
              //latlng[0], latlng[1]
            //]
          //}
        //}) );
      //}
    //})() );

  }
  , this );

};

return Historia;

});


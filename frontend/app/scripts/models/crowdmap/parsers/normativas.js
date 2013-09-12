define( [ 
    'jquery' 
    ,'underscore'
    ,'backbone'
    ,'models/qpr/Feature'
    ,'models/crowdmap/parsers/base'
    ,'utils'
    ], 

function( $, _, Backbone,  
  Feature, CrowdmapParserBase, utils ) 
{

'use strict';

function Normativas( opt ) 
{
  _.extend( this, CrowdmapParserBase );

  this.opt = opt;

  this.db = function()
  {
    return _db;
  }

  var _db = {
    task: 'incidents'
    ,by: 'catname'
    ,name: 'normativas'
  };

}

return Normativas;

});


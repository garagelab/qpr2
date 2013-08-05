define( [ 
    'models/crowdmap/layer'
    ,'models/crowdmap/layer_parsers/alertas'
    ], 

function( 
  Layer
  ,LParserAlertas
  ) 
{

'use strict';

return {
  Layer: Layer
  ,LayerParsers: {
    Alertas: LParserAlertas
  }
};

});


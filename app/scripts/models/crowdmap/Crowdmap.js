define( [ 
    'models/crowdmap/api'
    ,'models/crowdmap/layer_parsers/alertas'
    ,'models/crowdmap/layer_parsers/noticias'
    ], 

function( 
  API
  ,LayerParserAlertas
  ,LayerParserNoticias
  ) 
{

'use strict';

return {
  API: API
  ,LayerParsers: {
    Alertas: LayerParserAlertas
    ,Noticias: LayerParserNoticias
  }
};

});


define( [ 
    'models/crowdmap/api'
    ,'models/crowdmap/layer_parsers/historias'
    ,'models/crowdmap/layer_parsers/alertas'
    ,'models/crowdmap/layer_parsers/noticias'
    ], 

function( 
  API
  ,LayerParserHistorias
  ,LayerParserAlertas
  ,LayerParserNoticias
  ) 
{

'use strict';

return {
  API: API
  ,LayerParsers: {
    Historias: LayerParserHistorias
    ,Alertas: LayerParserAlertas
    ,Noticias: LayerParserNoticias
  }
};

});


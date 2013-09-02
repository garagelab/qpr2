define( [ 
    'models/crowdmap/api'
    ,'models/crowdmap/parsers/historias'
    ,'models/crowdmap/parsers/alertas'
    ,'models/crowdmap/parsers/noticias'
    ], 

function( 
  API
  ,ParserHistorias
  ,ParserAlertas
  ,ParserNoticias
  ) 
{

'use strict';

return {
  API: API
  ,Parsers: {
    Historias: ParserHistorias
    ,Alertas: ParserAlertas
    ,Noticias: ParserNoticias
  }
};

});


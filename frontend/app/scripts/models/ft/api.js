define( [ 
    'jquery'
    ,'underscore'
    ], 

function( $, _ ) 
{

'use strict';

var apikey = 'AIzaSyDGFlbdQqjeLGeLVk_9stEtLOv9hSNN2Sw';

var FT_API = function( opt )
{
  this.options = opt;
};

FT_API.prototype.access = function( callback )
{

  var ftid = this.options.ftid;
  var _fn = this.access;

  if ( !_fn.tables )
    _req_tables();
  else 
    _cb();

  function _cb()
  {
    callback( _.indexOf(_fn.tables, ftid) > -1 );
  }

  function _req_tables()
  {
    gapi.client.request({
      path: '/fusiontables/v1/tables'
      ,params: {
        maxResults: 1000
      }
      ,callback: function( res ) 
      {
        _fn.tables = res.items 
          ? _.pluck(res.items, 'tableId')
          : [];
        _cb();
      }
    });
  }

};

FT_API.prototype.destroy = 
function( model, success, error )
{
  //console.log( 'ft destroy', arguments ); 

  var ftid = this.options.ftid;
  var ROWID = model.get('ROWID');

  gapi.client.request({

    path: '/fusiontables/v1/query'
    ,method: 'POST'
    ,params: {
      sql: [
        'DELETE FROM '
        ,ftid
        ,' WHERE '
        ,'ROWID'
        ,' = '
        ,'\''+ ROWID +'\''
      ]
      .join('')
    }

    ,callback: function( res ) 
    {
      if ( success ) success( res );
    }

  });

}

FT_API.prototype.create = 
function( model, success, error )
{

  var ftid = this.options.ftid;
  var data = model.toJSON();

  var keys = _.keys(data).join(',');
  var vals = _.map( _.values(data), function(d)
  {
    return '\''+d+'\'';
  })
  .join(',');

  gapi.client.request({

    path: '/fusiontables/v1/query'
    ,method: 'POST'
    ,params: {
      sql: [
        'INSERT INTO '
        ,ftid
        ,' (' + keys + ') '
        ,'VALUES'
        ,' (' + vals + ')'
      ]
      .join('')
    }

    ,callback: function( res ) 
    {
      if ( success ) success({
        ROWID: res.rows[0][0]
      });
    }

    //,headers: {
      //'Authorization': 
        //'Bearer ' + tk.access_token
    //} 

  });

};

FT_API.prototype.read = 
function( model, success, error )
{

  var ftid = this.options.ftid;

  var sql = [
    'SELECT '
    ,this.options.read.cols.join(',')
    ,' FROM '
    ,ftid
    ,this.options.read.filters || ''
  ]
  .join('');

  var url = [
    'https://www.googleapis.com/fusiontables/v1/query'
    ,'?sql=' + encodeURIComponent( sql )
    ,'&key=' + apikey
    ,'&callback=?'
  ]
  .join('');

  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: success
  });

  //Architect.jsonp( url, success );
}; 

return FT_API;

});


define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var Stats = function()
{
  var _stats = {}; 
  //var _layers = {}; 
  //var _industrias = {};

  this.get = function( key )
  {
    return _stats[ key ] || {};
  }

  this.add_feature = function( feature )
  { 
    update_feature( feature );
    //update_layer( layer );
    //update_industrias();
  } 

  function add_cant( k )
  {
    _stats[k] = _stats[k] || { cant: 0 };
    _stats[k].cant++;
  }

  function update_feature( feature )
  {
    if (feature.get('geometry').type !== 'Point')
      return;

    var props = feature.get('properties');

    add_cant( props.type );

    if ( props.type === 'industrias'
        && props.eventos )
    {
      var evs = _.pluck(props.eventos,'name');
      if ( _.contains(evs,'rec') )
      {
        add_cant( 'rec' );
      }
      else if ( _.contains(evs,'pri') )
      {
        add_cant( 'pri' );
        add_cant( 'ac' );
      }
      else if ( _.contains(evs,'ac') )
      {
        add_cant( 'ac' );
      }
    }
  }

  //function update_layer( layer )
  //{
    //var k = layer.name();
    //_layers[k] = _.filter( 
      //layer.model.toArray()
      //,function( feature )
      //{
        //return feature
          //.get('geometry').type === 'Point';
      //});
    //_stats[k] = {
      //cant: _layers[k].length
    //};
  //}

  //function update_industrias()
  //{
    //if ( ! _layers.industrias )
      //return;
    //_.each( _layers.industrias
      //,function( feature_ind )
      //{
        //_.each( 
          //feature_ind.get('properties').eventos
          //,function( ev )
          //{
            //var k = ev.name;
            //_industrias[k]++;
            //_stats[k] = {
              //cant: _industrias[k]
            //}
          //});
      //});
  //}

};

return Stats;

});


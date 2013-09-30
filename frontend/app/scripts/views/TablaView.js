define( [ 
  'jquery' 
  ,'underscore'
  ,'backbone'
  ,'utils'
  ,'text!tpl/tabla.html'
  ,'datatables'
  ], 

function( $, _, Backbone, utils, tpl )
{

'use strict';

var View = Backbone.View.extend({

  initialize: function() 
  { 
    //var opt = this.options;
    //this.listenTo( this.collection
      //,'parse:complete', this.render);
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    //var data = this.model.toJSON();

    this.$el.html( this.tpl({
      layer_name: this.options.layer_name
    }) );

    return this;
  }

  ,init_datatable: function()
  {

    var data = _.map( 
      this.collection.toArray()
      ,function( feature )
      { 
        var props = feature.get('properties');
        return [
          props.titulo
          ,utils.date_iso2arg( props.date.iso )
          ,'<a href="'+props.link_src+'" target="_blank">'+props.link_src+'</a>'
        ];
      } );

    this.datatable = $('#tabla').dataTable({

      "aaData": data 

      ,"bDeferRender": true
      ,"bDestroy": true
      //,"bFilter": false
      //,"iDisplayLength": 20

      //,"sDom": 'lfrtip'
      //'l' - Length changing
      //'f' - Filtering input
      //'t' - The table!
      //'i' - Information
      //'p' - Pagination
      //'r' - pRocessing

      ,"aoColumns": [
        { "sTitle": "Titulo" }
        ,{ 
          "sTitle": "Fecha" 
          ,"sClass": "center"
        }
        ,{ "sTitle": "Fuente" }
      ]

    });

  }

  ,events: {
    'click .close': 'close'
  }

  ,close: function()
  {
    //this.dispose_datatable();
    this.remove();
    this.trigger('close');
  }

  //FIXME datatables.fnDestroy !@#$%ˆ&*
  //,dispose_datatable: function()
  //{
    //if ( ! this.datatable 
    //|| !_.isFunction(this.datatable.fnDestroy))
      //return;
    //this.datatable.fnDetroy( true );
    //this.datatable = null;
  //}

});

return View;

});


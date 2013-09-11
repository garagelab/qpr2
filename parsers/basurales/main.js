/*
 * xml parser: elementtree
 * https://www.rackspace.com/blog/node-elementtree-node-js-library-to-build-and-parse-xml-documents/
 * https://github.com/racker/node-elementtree
 * http://effbot.org/zone/element-index.htm#usage
 * http://effbot.org/zone/element-xpath.htm
 */

var fs = require('fs');
var et = require('elementtree');

var filename = 'basurales_remanentes_abril_2013_solo_basurales';
var format = 'kml';

var data = fs
  .readFileSync( filename+'.'+format )
  .toString();

//var XML = et.XML;
var ElementTree = et.ElementTree;
var element = et.Element;
var subelement = et.SubElement;

var xml = et.parse( data );
var polis = xml.findall('.//Polygon');
var polis_containers = xml.findall('.//Polygon/..');
var names = xml.findall('.//Polygon/../name');
//var foundnames = xml.findall('.//Polygon/../../name');
var foundnames = xml.findall('.//Polygon/../../Placemark[Point]/name');

if ( polis.length !== foundnames.length )
  throw new Error('algo raro... la lista de poligonos y la lista de los nombres encontrados no tienen la misma cantidad de items... debe haber fallado la busqueda de nombres porque el kml tiene una estructura distinta a la esperada...?');

var i = polis.length;
while ( i-- )
{
  var poli = polis[i];
  var name = names[i];
  var foundname = foundnames[i];

  //console.log( 'basural', i );
  //console.log( 'nombre original = ', name.text );
  //console.log( 'nombre encontrado = ', foundname.text );
  ////console.log( 'container = ', polis_containers[i] );
  //console.log( '' );

  var desc = subelement( polis_containers[i], 'description');
  desc.text = foundname.text;
}

var out = xml.write({'xml_declaration': false});

fs.writeFileSync( filename + '_parsed.' + format, out );


#!/bin/bash

#./export_industrias.sh
#exporta a industrias.csv por default

python parser.py
sqlite3 qpr.sqlite <<!
.headers on
.mode csv
.output industrias.csv
select * from industrias_dje;
!

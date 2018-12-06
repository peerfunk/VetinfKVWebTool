#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
dbf2sqlite - convert dbf files into sqlite database
Ole Martin Bjørndalen
University of Tromsø
Adapted by peerfunk
Todo:
- -v --verbose option
- handle existing table (-f option?)
- primary key option? (make first column primary key)
- create only option?
- insert only option?
- options to select columns to insert?
"""

import os
import sys
import argparse
import sqlite3
import traceback
import re
import codecs
from mysql import connector
from dbfread import DBF
import unicodedata

typemap = {
    'F': 'FLOAT',
    'L': 'BOOLEAN',
    'I': 'INT',
    'C': 'TEXT', #  character set utf8
    'N': 'INT',  # because it can be integer or float
    'M': 'TEXT',
    'D': 'DATE',
    'T': 'DATETIME',
    '0': 'INTEGER',
}
charmap = {
    '\x81' :	'ü',
    '\x84' :	'ä',
    '\x94' :  'ö',
    'á'    :  'ß',
}

def add_table(cursor, table):
    """Add a dbase table to an open sqlite database."""
    sql= "DROP TABLE IF EXISTS `" + table.name +  "`"
    print(sql)
    cursor.execute(sql)

    field_types = {}
    
    for f in table.fields:
        field_types[f.name] = typemap.get(f.type, 'TEXT')
    
    #
    # Create the table
    #
    defs = ', '.join(['`%s` %s' % (f, field_types[f])
                      for f in table.field_names])
    defs =  "`id` int primary key auto_increment , " + defs
    sql = 'create table `%s` (%s)' % (table.name, defs)
    
    print(sql)
    cursor.execute(sql)

    # Create data rows
    refs = ', '.join(['' + f for f in table.field_names])
    
    for rec in table:
        recs = ""
        for f in table.field_names:
            div=""
            cur_val=rec[f]
            if cur_val == None:
                cur_val=0
            if recs == "":
                recs += div + str(cur_val) + div 
            elif(type(cur_val)  == str):
                recs += ", " + div + str(replace_specials(cur_val)) + div
            else:
                recs += ", " + div + (str(cur_val)) + div
        sql = 'insert into `%s` values (NULL,%s)' % (table.name,recs )
        print(sql)
        cursor.execute(sql)
        
def replace_specials(string):
  for letter in charmap:
    string = string.replace(letter , charmap[letter])
  return string

def parse_args():
    parser = argparse.ArgumentParser(
        description='usage: %prog [OPTIONS] table1.dbf ... tableN.dbf')
    arg = parser.add_argument

    arg('-e', '--encoding',
        action='store',
        dest='encoding',
        default=None,
        help='character encoding in DBF file')

    arg('--char-decode-errors',
        action='store',
        dest='char_decode_errors',
        default='strict',
        help='how to handle decode errors (see pydoc bytes.decode)')

    arg('tables',
        metavar='TABLE',
        nargs='+',
        help='tables to add to sqlite database')

    return parser.parse_args()

def main():
    args = parse_args()
    con = connector.Connect(user='root',password='',database='vetinf',host='localhost')
    cursor=con.cursor()
    for table_file in args.tables:
        try:
            add_table(cursor, DBF(table_file,
                                  lowernames=True,
                                  encoding=args.encoding,
                                  char_decode_errors=args.char_decode_errors))
        except UnicodeDecodeError as err:
            traceback.print_exc()
            sys.exit('Please use --encoding or --char-decode-errors.')

    con.commit()

    #
    # Dump SQL schema and data to stdout if no
    # database file was specified.
    #
    # This currently only works in Python 3,
    # since Python 2 somehow defaults to 'ascii'
    # encoding.
    #

main()

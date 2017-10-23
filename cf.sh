#!/bin/bash

bin/rake cf:on_first_instance db:migrate && bin/rails s -p $PORT -e $RAILS_ENV

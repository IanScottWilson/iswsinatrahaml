require 'sinatra'



get '/' do
  haml :index, :format => :html5
end

#This will have to go else where

def print_information
    puts "Infoo!!"
end

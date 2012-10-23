require 'sinatra'



get '/' do
  @page_description = "ianscottwilson.com: web developers and IT specialists. Location: North London"  
  haml :index, :format => :html5
end

#This will have to go else where

def print_information
    puts "Infoo!!"
end

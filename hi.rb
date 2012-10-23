require 'sinatra'


$contact_address = "/contact"

get '/' do
  @page_type = "page-index"
  @page_id = "page-index"  
  @page_description = "ianscottwilson.com: web developers and IT specialists. Location: North London"  
  @path_content = "<h1 id='title'>ianscottwilson</h1>"
  @tagline_content = "Need a web presence? We can design and develop your website, arrange for hosting (free or paid), advise on the best hosting options. We can even teach you to do these things for yourself!" 
  haml :index, :layout => :template1, :format => :html5
end

get '/webdev' do
    @page_type = "page-plain nonzz"
    @page_id = "nomatter"
    @page_description = "Expertise: Web development"
    #@path_content = "<p><a href='/'>I<span>an</span>S<span>cott</span>W<span>ilson.com</span></a></p><h1>Web Development</h1>"
    @path_content = haml :webdevpath
    @tagline_content = "We can work with you to put your vision into practice."
    haml :webdev, :layout => :template1, :format => :html5
end

get '/contact' do
    @page_type = "page-plain nonzz"
    @page_id = "nomatter"
    @page_description = "Contact information for: ianscottwilson.com Web developers and IT specialists North London."
    @path_content = haml :contactpath
    @tagline_content = haml :contactblurb
    haml :contact, :layout => :template1, :format => :html5
end

get '/adhoc' do
    @page_type = "page-plain nonzz"
    @page_id = "nomatter"
    @page_description = "Miscellany: Information Technology related Serendipity"
    @path_content = haml :adhocpath
    @tagline_content = haml :adhocblurb
    haml :adhoc, :layout => :template1, :format => :html5
end

get '/itspecialists' do
  @page_type = "page-plain nonzz"
  @page_id = "nomatter"
  @page_description = "Hardware: maintenance, network, system build, repair, upgrade. Software: Linux, Windows, system installation. Training: Web development, IT skills."
  @path_content = haml :itspecialistspath
  @tagline_content = haml :itspecialistsblurb
  haml :itspecialists, :layout => :template1, :format => :html5
end

get '/blog' do
  @page_type = "page-plain nonzz"
  @page_id = "nomatter"
  @page_description = "Author: Ian Wilson, Topics: Web development, IT, Science, Mathematics, Humour"
  @path_content = haml :blogpath
  @tagline_content = haml :blogblurb
  haml :blog, :layout => :template1, :format => :html5
end

get '/zigzag' do
  @local_head = haml :drawingcodelinks
  @local_bottom = haml :zigzagjslinks
  @page_type = "page-plain"
  @page_id ="nomatter"
  @page_description = "Topic: A working SVG drawing program in the browser. Linked Subjects: Lindenmeyer systems. Graphics. Computer art. Author: ianscottwilson.com"
  @path_content = haml :zigzagpath
  @tagline_content = haml :zigzagblurb
  haml :zigzag, :layout => :template1, :format => :html5
end
#This will have to go else where

def print_information
    puts "Infoo!!"
end

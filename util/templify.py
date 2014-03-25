import os
import sys

from mako.template import Template
from mako.lookup import TemplateLookup
from mako.runtime import Context
from StringIO import StringIO

mylookup = TemplateLookup(directories=['swissguesser/templates'], module_directory='/tmp/mako_modules')

def serve_template(templatename, ctx):
    mytemplate = mylookup.get_template(templatename)
    #print mytemplate.render(**kwargs)
    
    #print ctx.keys()
    mytemplate.render_context(ctx)

  
    


def get_available_lang(locale_dir):
    return [o for o in os.listdir(locale_dir) if os.path.isdir(os.path.join(locale_dir,o))]
    

if __name__ == '__main__':

    import json

    project = sys.argv[1]


    langs = get_available_lang('swissguesser/static/%s/data/locale' % project)

    for lang in langs:

        with open('swissguesser/static/%s/data/locale/%s/translation.json' % (project, lang)) as data_file:
            data = json.load(data_file)
        for key in data.keys():
            data[key.replace('-','_')] = data.pop(key)

        data['lang'] = lang
        data['Preview_Url'] = u"images/preview.jpg" # relative url should work
        data['App_Url'] = u"http://storymaps.geo.admin.ch/storymaps/%s" % project
        buf = StringIO()
        ctx = Context(buf,**data)

        print ctx.keys()

        serve_template('index.html.mako', ctx)
        html = buf.getvalue().encode('utf-8')
        
        with open('swissguesser/static/%s/index.html.%s' % (project,lang), 'w') as f:
            f.write(html)

    




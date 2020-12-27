#!/usr/bin/python3

from wsgiref.simple_server import make_server
import json
import cgi
import urllib
import sys

port = 55555
numrooms = 10
numusers = {}

# print(json.dumps(numusers))

def application(env, start_response):
    querystr = env['QUERY_STRING']

    qupper=querystr.upper()

    # parse QUERY_STRING
    # query = cgi.parse_qsl(querystr)
    query = urllib.parse.parse_qsl(querystr)
    query = dict(query)
    
    for k in query:
        if k in numusers:
            try:
                val=int(query[k])
                if val==-1:
                    numusers[k]=numusers[k]-1
                    if numusers[k] < 0:
                        numusers[k]=0
                else:
                     numusers[k]=val
            except:
                pass

    content_type = 'application/json'
     
    output = json.dumps(numusers).encode()
     
    response_headers = [('Content-type', content_type),
                        ('Content-Length', str(len(output)))]
    
    status = '200 OK'
    start_response(status, response_headers)
    return [output]

if __name__ == "__main__":
    if (len(sys.argv) > 2):
        sys.stderr.write("usage: %s <rooms>\n" % sys.argv[0])
        sys.exit(1)
    if (len(sys.argv) == 2):
        numrooms = int(sys.argv[1])
    for n in range(0,numrooms):
        numusers[str(n)]=0
        
    make_server('', port, application).serve_forever()
             
#!/usr/bin/env python

import socket
import re
import os
import urllib2
import threading
import time

#Get public facing hostname. 
hostname = urllib2.urlopen("http://blueshirtdesign.com/con/chost.php").read()

#get local IP address
IP = socket.gethostbyname(socket.getfqdn())



def ping():
	print "pinging"
	urllib2.urlopen("http://blueshirtdesign.com/con/con.php?action=add&host=" + hostname + "&ip=" + IP + "&app=pebbleflix").read()
    
    
def pinger():
    while(True):
    	ping()
    	time.sleep(12)



ping_thread = threading.Thread(target = pinger)
ping_thread.daemon = True
ping_thread.start()

# Standard socket stuff:
host = ''  # do we need socket.gethostname() ?
port = 8189
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
sock.bind((host, port))
sock.listen(1)  # don't queue up any requests

# Loop forever, listening for requests:
while True:
    csock, caddr = sock.accept()
    #print "Connection from: " + `caddr`
    req = csock.recv(1024)  # get the request, 1kB max
    #print req
    # Look in the first line of the request for a move command
    # A move command should be e.g. 'http://server/move?a=90'
    match = re.match('GET /action\?a=([1-3]+)\sHTTP/1', req)
    if match:
        action = match.group(1)
        #print "Action: " + action + "\n"
        
        if action=="1":
			cmd = """osascript -e 'tell application "System Events" to key code 49'"""
			os.system(cmd)
			print "space pressed"
        elif action=="2":
			cmd = """osascript -e 'tell application "System Events" to key code 126'"""
			os.system(cmd)
			os.system(cmd)
			print "up pressed"        
        elif action=="3":
			cmd = """osascript -e 'tell application "System Events" to key code 125'"""
			os.system(cmd)
			os.system(cmd)
			print "down pressed"        
        csock.sendall("""Success""")
    else:
        # If there was no recognised command then return a 404 (page not found)
        print "Returning 404"
        csock.sendall("HTTP/1.0 404 Not Found\r\n")
    csock.close()
    
    
    

kill -9 $(lsof -t -i:5000)
echo "Killed process running on port 5000"

unzip /home/ubuntu/mangacrawlers-server-node/server_nodejs.zip
echo "Unrar compress file"

/home/ubuntu/mangacrawlers-server-node/server_nodejs.rar
echo "Deleted compress file"

# /home/ubuntu/mangacrawlers-server-node/npm install
# echo "Installing package"

pm2 start /home/ubuntu/mangacrawlers-server-node/server.js  
pm2 startup
pm2 save  
echo "Started server on port 5000 using pm2"
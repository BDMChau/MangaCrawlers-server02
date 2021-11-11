
# Copy manga_spring_execute_commands_on_ec2.sh file which has commands to be executed on server... Here we are copying this file
# every time to automate this process through 'deploy.sh' so that whenever that file changes, it's taken care of
scp -i "D:/School/Document/AWS/key_instance01_singapore.pem" manga_node_execute_commands_on_ec2.sh ubuntu@ec2-54-255-229-6.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/
echo "Copied latest 'manga_node_execute_commands_on_ec2.sh' file from local machine to ec2 instance"

7z a server_nodejs.zip server.js src package.json package-lock.json
echo "Compress except unnecessary files"

scp -i "D:/School/Document/AWS/key_instance01_singapore.pem" server_nodejs.zip ubuntu@ec2-54-255-229-6.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/mangacrawlers-server-node
echo "Copied zip file from local machine to ec2 instance"

rm -rf server_nodejs.zip
echo "Deleted compress file"

echo "Connecting to ec2 instance and run manga_node_execute_commands_on_ec2.sh to start server using pm2"
ssh -i "D:/School/Document/AWS/key_instance01_singapore.pem" ubuntu@ec2-54-255-229-6.ap-southeast-1.compute.amazonaws.com /home/ubuntu/mangacrawlers-server-node/manga_node_execute_commands_on_ec2.sh

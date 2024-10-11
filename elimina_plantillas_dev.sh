alias sam="/c/Program\ Files/Amazon/AWSSAMCLI/bin/sam.cmd"
nombre_stack_dos="cloudfront-todo-terreno"
nombre_stack_uno="todo-terreno"
sam delete --stack-name $nombre_stack_dos --region us-east-1
sam delete --stack-name $nombre_stack_uno --region us-west-1
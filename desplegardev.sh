#sam validate --template-file plantilla-dev.yaml
#sam deploy --template-file plantilla-dev.yaml --config-file configuracion-dev.toml
alias sam="/c/Program\ Files/Amazon/AWSSAMCLI/bin/sam.cmd"
nombre_stack="todo-terreno"
region_plantilla_recursos="us-west-1"
m="UPDATE_COMPLETE"
gt="CREATE_COMPLETE"

sam validate --template-file despliegue_stacks.yaml
sam deploy --template-file despliegue_stacks.yaml --stack-name $nombre_stack --region $region_plantilla_recursos --config-file configdev.toml --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM


esta_true=$(aws cloudformation describe-stacks --stack-name $nombre_stack --region $region_plantilla_recursos --query 'Stacks[0].StackStatus' --output text)
echo $esta_true

# if [ $esta_true = $m ] || [ $esta_true = $gt ]
# then
#     salidas_t=$(aws cloudformation describe-stacks --stack-name $nombre_stack --region $region_plantilla_recursos --query 'Stacks[0].Outputs[?OutputKey==`DominioDelApi`].OutputValue' --output text)
#     salidas_stage=$(aws cloudformation describe-stacks --stack-name $nombre_stack --region $region_plantilla_recursos --query 'Stacks[0].Outputs[?OutputKey==`EtapaPrincipal`].OutputValue' --output text)
#     echo $salidas_t
#     echo $salidas_stage
#     sam validate --template-file cloudfront.yaml
#     sam deploy --template-file cloudfront.yaml --config-file configcloudfront.toml --parameter-overrides RefApiRegion=$salidas_t RefApiStageRegion=$salidas_stage
# else
#     echo "ESTATUS FAllido primera plantilla"
# fi
import boto3
import json
from fabric.api import local

def latestStackName(stackName):
    return '%s:latest' % (stackName)

def imageName(stackName):
    return '335754127586.dkr.ecr.us-west-2.amazonaws.com/%s' % (latestStackName(stackName))

def build(stackName, port):
    local('docker build --build-arg NODE_PORT=%s -t %s .' % (port, stackName))
    local('docker tag %s %s' % (latestStackName(stackName), imageName(stackName)))

def run(stackName, port='5000'):
    local('docker run -it --rm -p %s:%s %s' % (port, port, imageName(stackName)))

def push(stackName):
    local('docker push %s' % (imageName(stackName)))

def login():
    local('eval $(aws ecr get-login --no-include-email --region us-west-2)')

def updateServicePayload(stackName, desiredCount):
    payload = {
        'cluster': 'default',
        'desiredCount': desiredCount
    }
    cf = boto3.client('cloudformation')
    response = cf.describe_stack_resources(StackName=stackName)
    if 'StackResources' in response:
        for resource in response['StackResources']:
            if resource['ResourceType'] == 'AWS::ECS::TaskDefinition':
                payload['familyPrefix'] = resource['PhysicalResourceId'].split('/')[-1].split(':')[0]
            if resource['ResourceType'] == 'AWS::ECS::Service':
                payload['service'] = resource['PhysicalResourceId'].split('/')[-1]
    return payload


# def updateService(stackName, desiredCount):
#     awsLambda = boto3.client('lambda')
#     payload = updateServicePayload(stackName, desiredCount)
#     response = awsLambda.invoke(FunctionName='ecs-deployer-Deployer-2YOIB68AQBIZ', Payload=json.dumps(payload))
#     print(response['Payload'].read())

def deploy(stackName='civic-api', port='5000', desiredCount=1):
    build(stackName, port)
    login()
    push(stackName)
    # updateService(stackName, desiredCount)

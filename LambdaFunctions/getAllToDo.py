import json
import boto3
from botocore.exceptions import ClientError

dynamoDB = boto3.client('dynamodb')

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",  # Change this to your actual domain if needed
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    }

    try:
        response = dynamoDB.scan(TableName='Todolist')

        if 'Items' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps('No Todo items found')
            }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response['Items'])
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': 'Error retrieving Todo items', 'error': e.response['Error']['Message']})
        }

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
        # Check if 'id' is present in the query string parameters directly
        id = event.get('queryStringParameters', {}).get('id')

        if not id:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'message': 'Invalid request format. Query parameter "id" is missing.'})
            }

        params = {
            'TableName': 'Todolist',
            'Key': {
                'id': {'N': id}
            }
        }

        response = dynamoDB.get_item(**params)
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps('Todo item not found')
            }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response['Item'])
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': 'Error retrieving Todo item', 'error': str(e)})
        }

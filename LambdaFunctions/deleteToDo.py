import json
import boto3
from botocore.exceptions import ClientError

dynamo = boto3.resource('dynamodb')
table_name = 'Todolist'
table = dynamo.Table(table_name)

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",  # Change this to your actual domain if needed
        "Access-Control-Allow-Methods": "OPTIONS,DELETE"
    }

    try:
        todo_id = int(event.get('queryStringParameters', {}).get('id'))
        
        table.delete_item(
            Key={
                'id': todo_id
            }
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'ToDo item deleted successfully'})
        }
    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Invalid request format', 'error': str(e)})
        }
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Invalid ID format', 'error': str(e)})
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': 'Could not delete the item', 'error': e.response['Error']['Message']})
        }

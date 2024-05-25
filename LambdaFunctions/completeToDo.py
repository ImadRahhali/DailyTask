import json
import boto3
from botocore.exceptions import ClientError

dynamo = boto3.resource('dynamodb')
table_name = 'Todolist'
table = dynamo.Table(table_name)

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE,PUT"
    }

    try:
        todo_id = int(event.get('queryStringParameters', {}).get('id'))
        
        response = table.update_item(
            Key={'id': todo_id},
            UpdateExpression='SET #status = :val',
            ExpressionAttributeNames={'#status': 'status'},
            ExpressionAttributeValues={':val': 'COMPLETED'}
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'Todo item status updated to COMPLETED'})
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
            'body': json.dumps({'message': 'Could not update the item status', 'error': e.response['Error']['Message']})
        }

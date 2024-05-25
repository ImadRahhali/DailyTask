import json
import boto3
from botocore.exceptions import ClientError

dynamo = boto3.resource('dynamodb')
table_name = 'Todolist'
table = dynamo.Table(table_name)

def generate_unique_id():
    import random
    return random.randint(1, 99999)

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE"
    }

    try:
        # Parse the event body
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event

        name = body['name']

        while True:
            id = generate_unique_id()
            response = table.get_item(Key={'id': id})
            if 'Item' not in response:
                break 

        item = {
            'id': id,
            'name': name,
            'description':'No Description',
            'status': 'UNCOMPLETED'
            # Default status
        }

        table.put_item(Item=item)
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'message': 'ToDo item added successfully!'})
        }
    except KeyError as e:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Invalid request format', 'error': str(e)})
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'message': 'Could not add the item', 'error': e.response['Error']['Message']})
        }

import json
import boto3
from botocore.exceptions import ClientError

dynamoDB = boto3.client('dynamodb')

def lambda_handler(event, context):
    try:
        id = event.get('queryStringParameters', {}).get('id')

        request_body = json.loads(event['body'])
        updated_name = request_body.get('name')
        updated_description = request_body.get('description')

        update_expression = 'SET '
        expression_attribute_values = {}

        if updated_name:
            update_expression += '#newname = :newname, '
            expression_attribute_values[':newname'] = {'S': updated_name}

        if updated_description:
            update_expression += 'description = :desc, '
            expression_attribute_values[':desc'] = {'S': updated_description}


        update_expression = update_expression.rstrip(', ')

        response = dynamoDB.update_item(
            TableName='Todolist',
            Key={
                'id': {'N': id}
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames={'#newname': 'name'},  
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues='ALL_NEW'
        )

        headers = {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",  
            "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,DELETE,HEAD"
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response['Attributes'])
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
            'body': json.dumps({'message': 'Error updating Todo item', 'error': e.response['Error']['Message']})
        }

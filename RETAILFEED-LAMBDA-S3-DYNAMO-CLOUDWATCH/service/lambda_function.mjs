import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// Initialize S3 and DynamoDB clients
const s3Client = new S3Client();
const dynamoClient = new DynamoDBClient();

export const lambda_handler = async (event) => {
  const bucketName = "retailfeeds3bucket232323";
  const tableName = "retaildynamodbtable";

  try {
    // Fetch the JSON file content from S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: "cdktestfile.json",
    };

    const s3Data = await s3Client.send(new GetObjectCommand(getObjectParams));

    // Convert stream to string
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const jsonContent = JSON.parse(await streamToString(s3Data.Body));

    // Prepare the DynamoDB put request
    const dynamoParams = {
      TableName: tableName,
      Item: {
        customername: { S: jsonContent.customername },
        Product: { S: jsonContent.Product },
        Address: { S: jsonContent.Address },
        Quantity: { N: jsonContent.Quantity }, // Assuming Quantity is stored as a number
      },
    };

    // Write data to DynamoDB
    await dynamoClient.send(new PutItemCommand(dynamoParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data saved to DynamoDB successfully!" }),
    };
  } catch (error) {
    console.error("Error processing data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process data" }),
    };
  }
};

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function convertUTCtoLocalTime(time) {
    const result = new Date(time);
    return result.toLocaleString("en-GB");
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

async function AWS_upload_file(file) {
    try {
        if (!file) {
            return {
                success: false,
                error: "No file selected"
            };
        }

        const S3_Client = new S3Client({
            region: 'ap-south-1',
            credentials: {
                accessKeyId: import.meta.env.VITE_AWS_S3_ACCESS_KEY,
                secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY
            }
        });

        const fileName = `${Date.now()}-${file.name}`;
        const key = `uploads/wechat/${fileName}`;
        const fileContent = await readFileAsArrayBuffer(file);

        const command = new PutObjectCommand({
            Bucket: 'goutham469uploads',
            Key: key,
            Body: fileContent,
            ContentType: file.type
        });

        await S3_Client.send(command);
        const fileUrl = `https://goutham469uploads.s3.amazonaws.com/${key}`;

        return {
            success: true,
            data: {
                file_url: fileUrl
            }
        };
    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

export const tools = { convertUTCtoLocalTime, AWS_upload_file };

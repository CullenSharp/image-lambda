console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const size = event.Records[0].s3.object.size;
    const params = {
        Bucket: bucket,
        Key: key
    };
    try {
        const manifest = await s3.getObject({Bucket: 'cts-images-for-all', Key: 'images.json'}).promise();
        
        // get the list of images from the manifest
        const images = JSON.parse(manifest.Body.toString());
        console.log('images before transform', images);
        
        
        // get metadata from the newly created record
        const { ContentType, LastModified } = await s3.getObject(params).promise();
        
        // create an entry for the new image
        const newImage = {
            key: key,
            lastModified: LastModified,
            type: ContentType,
            size: size
        }
        
        // add it to the list of images
        images.images.push(newImage);
        console.log('images after transform', images);
        
        // add it back the the bucket
        await s3.putObject({
            Body: JSON.stringify(images),
            Bucket: 'cts-images-for-all',
            Key: 'images.json'
        }, (error, data) => {
            if (error) { console.log(error); }
            else { console.log(data); }
        });
       
        return 'complete';
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};

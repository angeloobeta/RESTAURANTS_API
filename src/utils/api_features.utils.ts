// eslint-disable-next-line @typescript-eslint/no-var-requires
import { S3 } from 'aws-sdk';

const nodeGeoCoder = require('node-geocoder');
import { Location } from '../restaurants/schemas/restaurants.schema';

export default class ApiFeatures {
  static async getRestaurantLocation(address) {
    try {
      const options = {
        provider: process.env.GEOCODER_PROVIDER,
        httpAdapter: 'https',
        apiKey: process.env.GEOCODER_API_KEY,
        formatter: null,
      };

      const geoCoder = nodeGeoCoder(options);

      const loc = await geoCoder.geocode(address);

      const location: Location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
      };
      return location;
    } catch (e) {
      console.log(e.message);
    }
  }

  // Delete Images from S3 Bucket
  static deleteImages(images) {
    // get s3 instance
    const s3Bucket = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    const imagesKey = images.map((image) => {
      return { Key: image.key };
    });

    const param = {
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
      Delete: { Objects: imagesKey, Quiet: false },
    };

    return new Promise((resolve, reject) => {
      // s3Bucket.deleteObject(param, function (error, data) {
      //   if (error) {
      //     return reject(false);
      //   } else {
      //     resolve(true);
      //   }
      // });
    });
  }

  // Upload Images to S3 Bucket
  static uploadImages(files) {
    return new Promise((resolve, reject) => {
      // get s3 instance
      const s3Bucket = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });

      const images = [];
      files.forEach(async (file) => {
        const splitFile = file.originalname.split('.');
        const random = Date.now();
        const fileName = `${splitFile[0]}_${random}.${splitFile[1]}`;
        images.push(fileName);

        const param = {
          Bucket: `${process.env.AWS_S3_BUCKET_NAME}/restaurants`,
          key: fileName,
          Body: file.buffer,
        };

        // const uploadResponse = await s3Bucket.upload(param).promise();
        // images.push(uploadResponse);

        if (images.length == files.length) {
          resolve(images);
        }
      });
    });
  }
}

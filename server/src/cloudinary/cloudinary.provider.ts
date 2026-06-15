import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    cloudinary.config({
      cloud_name: 'dgubykblb',
      api_key: '286623774792755',
      api_secret: 'Tak6g2oXwGin_1i4DQhUkkitci0',
    });
    return cloudinary;
  },
};

import { Cloudinary } from '@cloudinary/url-gen'
import { upload } from 'cloudinary-react-native'
import { UploadApiResponse } from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params'

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'your_api_key';
const CLOUDINARY_API_SECRET = process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || 'your_api_secret';

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
  }
})

export async function uploadImage(file_uri: string): Promise<UploadApiResponse> {
  let upload_result: UploadApiResponse = {} as UploadApiResponse;
  console.log('Uploading image...');
  let res = await upload(cld, {
    file: file_uri,
    callback: (error, result) => {
      if (result) {
        upload_result = result;
        console.log(result);
      }
      if (error) {
        console.log(error);
      }
    }
  },);
  return upload_result;
}


type CloudinaryUploadResult = {
  api_key: string;
  asset_folder: string;
  asset_id: string;
  bytes: number;
  created_at: string;
  display_name: string;
  etag: string;
  format: string;
  height: number;
  original_filename: string;
  placeholder: boolean;
  public_id: string;
  resource_type: string;
  secure_url: string;
  signature: string;
  tags: string[];
  type: string;
  url: string;
  version: number;
  version_id: string;
  width: number;
}
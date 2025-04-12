import { EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME, EXPO_PUBLIC_CLOUDINARY_API_KEY, EXPO_PUBLIC_CLOUDINARY_API_SECRET } from '@env';
// import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '@/secret'
import { Cloudinary } from '@cloudinary/url-gen'
import { upload } from 'cloudinary-react-native'
import { UploadApiResponse } from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params'

const cld = new Cloudinary({
  cloud: {
    cloudName: EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: EXPO_PUBLIC_CLOUDINARY_API_KEY,
    apiSecret: EXPO_PUBLIC_CLOUDINARY_API_SECRET,
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
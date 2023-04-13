/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import cloudinary from 'cloudinary';
import Local from '../src/providers/locals';

cloudinary.v2.config({
    cloud_name: Local.config().cloudinaryCloudName,
    api_key: Local.config().cloudinaryApiKey,
    api_secret: Local.config().cloudinaryApiSecret
});

class Cloudinary {
    public cloudinaryUpload = async (file: any): Promise<any> => {
        return await cloudinary.v2.uploader.upload(
            file,
            { eager: [{ fetch_format: 'auto', format: 'pdf' }] },
            function (error: any, result: any) {
                if (error) {
                    console.log(error);
                }
                console.log(result);
                return result;
            }
        );
    };

    public cloudinaryDelete = async (public_id: string): Promise<any> => {
        return await cloudinary.v2.uploader
            .destroy(public_id)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(error => {
                console.log(error);
            });
    };

    public cloudinaryDeleteAll = async (public_ids: any): Promise<any> => {
        return await cloudinary.v2.api
            .delete_resources(public_ids)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });
    };
}

export default new Cloudinary();

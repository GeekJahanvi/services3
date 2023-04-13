import { Request, Response } from 'express';
import  Common  from '../../commons';
import  Mutations  from '../../graphql/medical_history/mutations';
import  Cloudinary  from '../../../helpers/cloudinary';

async function updateImageReport(image_id: number, imagename: string, new_image_url: string, new_image_public_id: string) {
console.log(image_id, imagename, new_image_url, new_image_public_id);
const { data, error } = await Common.createAction(
{
image_id: image_id,
imagename: imagename,
image_url: new_image_url,
image_public_id: new_image_public_id
},
Mutations.UPDATE_IMAGE_REPORT,
'update_image_reports'
);

console.log(data, '17');
return { updateImageData: data, updateImageError: error };
}

export const UpdateImageReport = {
async handle(req: Request, res: Response) {
try {
const { image_id, imagename, image_url, image_public_id } = req.body?.input?.input || req?.body?.input || req?.body;
if (image_public_id) {
    await Cloudinary.cloudinaryDelete(image_public_id);
  }

  let new_image_url = '', new_image_public_id = '';

  if (image_url) {
    const imageData = await Cloudinary.cloudinaryUpload(image_url);
    new_image_url = imageData.eager[0].secure_url;
    new_image_public_id = imageData.public_id;
  } else {
    new_image_url = '';
    new_image_public_id = ''
  }

  const { updateImageData, updateImageError } = await updateImageReport(image_id, imagename, new_image_url, new_image_public_id);

  if (updateImageError) {
    return res.status(200).json({ status: false, message: updateImageError });
  }

  console.log(updateImageData);
  return res.status(200).json({ status: true, message: `image report is updated`, data: updateImageData.returning[0] });
} catch (error) {
  return res.status(200).json({ status: false, message: 'Something went wrong.' });
}
}
};

module.exports = UpdateImageReport.handle;


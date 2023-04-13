import { Request, Response } from 'express';
import  Mutations  from '../../graphql/medical_history/mutations';
import  Common  from '../../commons';
import  Cloudinary from '../../../helpers/cloudinary';

async function deleteMedicalSchool(medical_school_id: string) {
const { data, error } = await Common.createAction(
{ medical_school_id },
Mutations.DELETE_MEDICAL_SCHOOL,
'delete_medical_school'
);
console.log(medical_school_id);
console.log(data, "line27");
return { deletedData: data, deletedError: error };
}

const DeleteMedicalSchool = {
async handle(req: Request, res: Response) {
try {
const { medical_school_id } = req.body?.input?.input || req?.body?.input || req?.body;

const { deletedData, deletedError } = await deleteMedicalSchool(medical_school_id);

console.log(deletedData.returning[0], "line26");
if (deletedError) {
    return res.status(200).json({ status: false, message: deletedError });
}
if (deletedData.returning[0].school_public_id) {
    console.log("hello");
    await Cloudinary.cloudinaryDelete(deletedData.returning[0].school_public_id);
}
return res.status(200).json({ status: true, message: 'medical school deleted', data: deletedData.returning[0] });
}
catch (e) {
return res.status(200).json({ status: false, message: 'Something went wrong.' });
}
}
};

module.exports =  DeleteMedicalSchool.handle;
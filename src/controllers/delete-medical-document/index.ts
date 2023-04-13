import Mutations from '../../graphql/medical_history/mutations';
import Common from '../../commons';
import Cloudinary from '../../../helpers/cloudinary';
import { Request, Response } from 'express';

interface DeleteMedicalDocumentResult {
deletedData: any;
deletedError: any;
}

async function deleteMedicalDocument(medical_document_id: string): Promise<DeleteMedicalDocumentResult> {
const { data, error } = await Common.createAction(
{
medical_document_id: medical_document_id
},
Mutations.DELETE_MEDICAL_DOCUMENT,
'delete_medical_documents'
);
console.log(medical_document_id);
console.log(data, "line27");
return { deletedData: data, deletedError: error };
}

const DeleteMedicalDocument = {
async handle(req: Request, res: Response) {
try {
const { medical_document_id } = req.body?.input?.input || req?.body?.input || req?.body;

const { deletedData, deletedError } = await deleteMedicalDocument(medical_document_id);

console.log(deletedData.returning[0], "line26");
if (deletedError) {
  return res.status(200).json({ status: false, message: deletedError });
}
if (deletedData.returning[0].document_public_id) {
  console.log("hello");
  await Cloudinary.cloudinaryDelete(deletedData.returning[0].document_public_id);
}
return res.status(200).json({ status: true, message: 'medical document deleted', data: deletedData.returning[0] });
}
catch (e) {
return res.status(200).json({ status: false, message: 'Something went wrong.' });
}
}
};

module.exports =  DeleteMedicalDocument.handle;
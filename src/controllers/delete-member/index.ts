import { Request, Response } from "express";
import  Common  from '../../commons';
import  Cloudinary from '../../../helpers/cloudinary';
import  Queries  from "../../graphql/delete_user/queries";
import  Mutations  from "../../graphql/delete_user/mutations";

async function getPublicId(member_id: string) {
const { data, error } = await Common.createAction(
{
member_id: member_id,
},
Queries.GET_MEMBER_PUBLIC_ID,
"users"
);
console.log(data, "line14");
return { idData: data, idError: error };
}

async function deleteMember(member_id: string) {
console.log(member_id);
const { data, error } = await Common.createAction(
{
member_id: member_id,
},
Mutations.DELETE_MEMBER,
"delete_users"
);
// console.log(data);
console.log(data, "line27");
return { deletedData: data, deletedError: error };
}

const DeleteMember = {
async handle(req: Request, res: Response) {
try {
console.log("hello", "31");
const { member_id } =
req.body?.input?.input || req?.body?.input || req?.body;
console.log(member_id);
const { idData, idError } = await getPublicId(member_id);
console.log("hellloooo");
console.log(idData);
if (idError) {
  return res.status(200).json({ status: false, message: idError });
}
let array1: string[] = [];
if (idData.length != 0) {
  if (idData[0].profile_picture_public_id != null) {
    console.log("line45");
    array1.push(idData.profile_picture_public_id);
  }
}

console.log("heloooo", "57");

console.log(idData);
if (idData.length) {
  for (let i = 0; i < idData[0].images.length; i++) {
    array1[array1.length + i] = idData[0].images[i].image_public_id;
  }
  for (let i = 0; i < idData[0].labs.length; i++) {
    array1[array1.length + i] = idData[0].labs[i].lab_public_id;
  }
  for (let i = 0; i < idData[0].medical_documents.length; i++) {
    array1[array1.length + i] =
      idData[0].medical_documents[i].document_public_id;
  }
}
console.log(array1);
if (array1.length !== 0) {
  await Cloudinary.cloudinaryDeleteAll(array1);
}

//   console.log("hello","line57");
const { deletedData, deletedError } = await deleteMember(member_id);

console.log(deletedData, "line82");
if (deletedError) {
  return res.status(200).json({ status: false, message: deletedError });
}
return res
  .status(200)
  .json({ status: true, message: `member is deleted`, data: deletedData.returning[0] });
} catch (e) {
return res.status(200).json({ status: false, message: "Something went wronggg." });
}
},
};

module.exports =  DeleteMember.handle;
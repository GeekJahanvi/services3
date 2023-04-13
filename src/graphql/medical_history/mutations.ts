class Mutations {
  ADD_MEDICAL_DOCUMENT = `mutation add_medical_documents($user_id: uuid!, $document_name: String!, $document_url: String! , $document_public_id: String!) {
          insert_medical_documents(objects: {user_id: $user_id, document_name: $document_name, document_url: $document_url, document_public_id: $document_public_id}) {
            returning {
              id
              user_id
              document_name
              document_url
              document_public_id
            }
          }
        }`;

        ADD_IMAGE_REPORTS = `
mutation add_image_reports($user_id: uuid!, $image_url: String !, $imagename: String ! , $image_public_id: String!) {
    insert_image_reports(objects: {user_id: $user_id, image_url: $image_url, imagename: $imagename , image_public_id: $image_public_id}) {
      returning {
        user_id
        image_url
        imagename
        image_public_id
      }
    }
  }`;

  ADD_CERTIFICATE = `mutation add_certificate($certificate_name: String!, $certificate_url: String!, $user_id: uuid! , $certificate_public_id: String!) {
    insert_certificates(objects: {certificate_name: $certificate_name, certificate_url: $certificate_url, user_id: $user_id, certificate_public_id: $certificate_public_id}) {
      returning {
        id
        certificate_name
        certificate_url
        certificate_public_id
      }
    }
  }`;

  ADD_LABS_REPORTS = `
mutation add_lab_reports($user_id: uuid !, $lab_url: String!, $filename: String!, $lab_public_id:String!) {
    insert_lab_reports(objects: {user_id: $user_id, lab_url: $lab_url, filename: $filename, lab_public_id: $lab_public_id}) {
      returning {
        id
        user_id
        lab_url
        filename
        lab_public_id
      }
    }
  }`;

        DELETE_IMAGE_REPORT = `mutation delete_image_report($image_report_id: uuid!) {
          delete_image_reports(where: {id: {_eq: $image_report_id}}) {
            returning {
              image_url
              imagename
              id
              image_public_id
            }
          }
        }`;

        DELETE_LAB_REPORT = `mutation delete_lab_report($lab_report_id: uuid!) {
          delete_lab_reports(where: {id: {_eq: $lab_report_id}}) {
            returning {
              filename
              lab_url
              id
              lab_public_id
            }
          }
        }`;

        DELETE_MEDICAL_DOCUMENT = `mutation delete_medical_document($medical_document_id: uuid!) {
          delete_medical_documents(where: {id: {_eq: $medical_document_id}}) {
            returning {
              document_name
              document_url
              id
              document_public_id
            }
          }
        }`;

DELETE_MEDICAL_SCHOOL = `mutation delete_medical_school($medical_school_id: uuid!) {
          delete_medical_school(where: {id: {_eq: $medical_school_id}}) {
            returning {
              id
              medical_school_name
              medical_school_url
              school_public_id
            }
          }
        }`;

        DELETE_CERTIFICATE = `mutation delete_certificate($certificate_id: uuid!) {
          delete_certificates(where: {id: {_eq: $certificate_id}}) {
            returning {
              certificate_name
              certificate_url
              id
              certificate_public_id
            }
          }
        }`;

UPDATE_IMAGE_REPORT = `mutation update_image_reports($image_id: uuid!, $imagename: String! , $image_url: String! , $image_public_id: String! ) {
          update_image_reports(where: {id: {_eq: $image_id}}, _set: {imagename: $imagename, image_url: $image_url , image_public_id: $image_public_id}) {
            returning {
              id
              imagename
              image_url
              image_public_id
            }
          }
        }`;

UPDATE_LAB_REPORT = `mutation update_lab_reports($lab_id: uuid! , $filename: String! , $lab_url: String! , $lab_public_id: String! ) {
          update_lab_reports(where: {id: {_eq: $lab_id}}, _set: {filename: $filename, lab_url: $lab_url , lab_public_id: $lab_public_id}) {
            returning {
              filename
              lab_url
              id
              lab_public_id
            }
          }
        }`;
}
export default new Mutations();

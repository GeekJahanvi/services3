class Mutations {
  ADD_USER_EDUCATION = `mutation add_user_education($user_id: uuid!, $fellow_ship_1: String!, $fellow_ship_1_url: String!, $fellow_ship_2: String!, $fellow_ship_2_url: String!, $state_medical_license: String!, $state_medical_license_url: String!, $fellowship1_public_id: String!, $fellowship2_public_id: String! ,  $state_public_id:String!) {
        insert_user_education(objects: {user_id: $user_id, fellow_ship_1: $fellow_ship_1, fellow_ship_1_url: $fellow_ship_1_url, fellow_ship_2: $fellow_ship_2, fellow_ship_2_url: $fellow_ship_2_url, state_medical_license: $state_medical_license, state_medical_license_url: $state_medical_license_url , fellowship1_public_id: $fellowship1_public_id , fellowship2_public_id: $fellowship2_public_id , state_public_id: $state_public_id}) {
          returning {
            id
            fellow_ship_1
            fellow_ship_1_url
            fellow_ship_2
            fellow_ship_2_url
            user_id
            state_medical_license
            state_medical_license_url
            fellowship1_public_id
            fellowship2_public_id
            state_public_id
          }
        }
    }`;

  UPDATE_USER_EDUCATION = `mutation update_user_education($doctor_id: uuid!, $fellow_ship_1: String!, $fellow_ship_1_url: String!, $fellow_ship_2: String!, $fellow_ship_2_url: String!, $state_medical_license: String!, $state_medical_license_url: String! , $fellowship1_public_id: String!, $fellowship2_public_id: String!, $state_public_id: String!) {
      update_user_education(where: {user_id: {_eq: $doctor_id}}, _set: {fellow_ship_1: $fellow_ship_1, fellow_ship_1_url: $fellow_ship_1_url, fellow_ship_2: $fellow_ship_2, fellow_ship_2_url: $fellow_ship_2_url, state_medical_license: $state_medical_license, state_medical_license_url: $state_medical_license_url, fellowship1_public_id: $fellowship1_public_id, fellowship2_public_id: $fellowship2_public_id, state_public_id: $state_public_id}) {
        returning {
          id
          fellow_ship_1
          fellow_ship_1_url
          fellow_ship_2
          fellow_ship_2_url
          user_id
          state_medical_license
          state_medical_license_url
          fellowship1_public_id,
          fellowship2_public_id,
          state_public_id
        }
      }
    }
    `;

  UPDATE_USER_EDUCATION_STATE_MEDICAL_LICENSE = `mutation update_user_education_state_license($state_medical_license_id: uuid!, $state_medical_license: String!, $state_medical_license_url: String!, $state_public_id: String!) {
      update_user_education(where: {id: {_eq: $state_medical_license_id}}, _set: {state_medical_license: $state_medical_license, state_medical_license_url: $state_medical_license_url, state_public_id: $state_public_id}) {
        returning {
          state_medical_license
          state_medical_license_url
          id
          state_public_id
        }
      }
    }
      `;

  UPDATE_USER_EDUCATION_FELLOWSHIP2 = `mutation update_user_education_fellowship2($fellow_ship_2_id: uuid!, $fellow_ship_2: String!, $fellow_ship_2_url: String!, $fellowship2_public_id: String!) {
      update_user_education(where: {id: {_eq: $fellow_ship_2_id}}, _set: {fellow_ship_2: $fellow_ship_2, fellow_ship_2_url: $fellow_ship_2_url, fellowship2_public_id: $fellowship2_public_id}) {
        returning {
          fellow_ship_2
          fellow_ship_2_url
          id
          fellowship2_public_id
        }
      }
    }`;

  UPDATE_MEDICAL_SCHOOL = `mutation update_medical_school($medical_school_id: uuid!, $medical_school_name: String!, $medical_school_url: String!, $school_public_id: String!) {
      update_medical_school(where: {id: {_eq: $medical_school_id}}, _set: {medical_school_name: $medical_school_name, medical_school_url: $medical_school_url, school_public_id: $school_public_id}) {
        returning {
          id
          medical_school_name
          medical_school_url
          school_public_id
        }
      }
    }`;

  UPDATE_MEDICAL_DOCUMENTS = `mutation update_medical_documents($medical_document_id: uuid! , $document_name: String! , $document_url: String!, $document_public_id: String!) {
      update_medical_documents(where: {id: {_eq: $medical_document_id}}, _set: {document_name: $document_name, document_url: $document_url, document_public_id: $document_public_id}) {
        returning {
          id
          document_name
          document_url
          document_public_id
        }
      }
    }`;
}
export default new Mutations();

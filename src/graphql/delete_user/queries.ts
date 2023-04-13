class Queries {
  GET_ALL_PUBLIC_IDS = `query get_doctors_public_ids($user_id: uuid! ) {
        users(where: {id: {_eq: $user_id}}) {
          profile_picture_public_id
          certificates {
            certificate_public_id
          }
          medical_schools {
            school_public_id
          }
          user_educations {
            fellowship1_public_id
            fellowship2_public_id
            state_public_id
          }
        }
      }`;

      GET_MEMBER_PUBLIC_ID = `query get_member_public_ids($member_id: uuid! ) {
        users(where: {id: {_eq: $member_id}}) {
          profile_picture_public_id
          images {
            image_public_id
          }
          labs {
            lab_public_id
          }
          medical_documents {
            document_public_id
          }
        }
      }`
}

export default new Queries();

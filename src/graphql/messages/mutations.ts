class Mutations {
  ADD_MESSAGES = `mutation add_messages($chat_room_id: uuid!, $user_id: uuid!, $content: String!, $created_at: timestamptz = "now()", $file_type: String!, $content_public_id: String) {
        insert_messages(objects: {chat_room_id: $chat_room_id, user_id: $user_id, content: $content, created_at: $created_at, file_type: $file_type, content_public_id: $content_public_id}) {
          returning {
            chat_room_id
            user_id
            content
            created_at
            id
            content_public_id
            file_type
          }
        }
      }`;
  DELETE_MESSAGES = `mutation delete_messages($message_id: uuid!) {
            delete_messages(where: {id: {_eq: $message_id}}) {
              returning {
                id
                chat_room_id
                content_public_id
                content
                user_id
                created_at
              }
            }
          }`;
}

export default new Mutations();

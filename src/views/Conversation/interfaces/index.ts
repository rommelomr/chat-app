import ChatUser from "@/logic/classes/ChatUser";

export interface IPersonConversationFinder {
    auth_id:string;
    name?: string;
    last_name?: string;
    photo?: string;
  }
  
export interface IUserConversationFinder {
    id?: number;
    access_code: string;
    username?: string;
    gender?: string;
    person?: IPersonConversationFinder;
}

export interface IMessage {
  content: {
    text: string;
  };
  created_at: string;
  conversation_id: number;
  chat_user_id: number;
  id: number;
  conversation_id_chat_user_id: string;
  is_forwarded: boolean;
  deleted_for_all: boolean;
  deleted_for_me: boolean;
  files: any[]; // You can replace 'any' with a specific type for files if available
  chat_user: ChatUser;
}

  export interface ContentMessage {
    text?:string,
    files?:Array<any>
  }

  export interface IBodyMessage {
    conversation_id: number,
    chat_user_id: number 
    content: ContentMessage
  }

  export interface INewConversation {
    conversation_type:number,
    conversation_name?: string,
    chat_users_ids: Array<number>,
    auth_ids: Array<string>, //son uuids (más seguros)
    content: ContentMessage,
  }

  export interface INewConversationResponse {
    conversation_answer: null;
    first_message: {
      conversation_id: number;
      message_id: number;
    };
  }
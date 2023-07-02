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




  export interface IChatGroup {
    id: number;
    created_at: string;
    conversation_id: number;
    name: string;
    photo: string;
    chat_user_id: number;
    conversations: IConversationGroup;
    chat_users: IChatUserGroup;
  }
  
  export interface IConversationGroup {
    type: number;
    created_at: string;
    deleted_at: string | null;
    participants_count: { count: number }[];
    name: string;
    id: number;
  }
  
  export interface IChatUserGroup {
    id: number;
    access_code: string;
    username: string;
    gender: string | null;
    created_at: string;
    deleted_at: string | null;
    person_id: number;
    current_license_id: string | null;
    is_online: boolean;
    last_connection: string;
    main_device_id: string;
  }

  
  
  
  
  
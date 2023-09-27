class Variables {
  ACTIVE_CHATS = 'https://qa.twixor.digital/moc/e/enterprise/chat/summary';
  CLOSED_CHATS = 'https://qa.twixor.digital/moc/e/enterprise/chat/summary';
  SUSPENDED_CHATS = 'https://qa.twixor.digital/moc/e/enterprise/chat/history?state=5&perPage=50&from=0&agent=100'
  
  TOKEN = '+V/ifK5YbvyFOmsvo/XmNmrzax8E28DdBqM/TZffOH8fXZJCEMLuKFgxM9RtZPcl';
  API_URL = 'http';
  EID = "";
  CUSTOMER_DETAILS = {};
  AgentId=0;
}

export default Variables;
export const AppConfig = {
  ENV: {
    CHATS: {
      ACTIVECHATS: 'active',
      CLOSEDCHATS: 'closed',
      CHATTRANSFER: 'Transfer Chat',
      INVITEAGENT: 'Invite Agent',
      CLOSECHAT: 'Close Chat',
      LEAVECHAT: 'Leave Chat',
      CUSTOMERDETAILS: 'Customer Details',
      UNREAD: 0,
      SENT: 1,
      READ: 2,
    },
    WEBSOCKET: {
      INITIAL_RECONNECT: 2000,
      RECONNECT_INTERVAL: 3000,
    },
    NETWORK: 'online',
    ATTACHMENT: {
      DOCTYPE: 0,
      MEDIATYPE: 1,
      MAPTYPE: 2,
      URLTYPE: 3,
      TAGTYPE: 4,
      MSGTYPE: 7,
      DOCUMENT: 'document',
      MAP: 'map',
      URL: 'url',
      MESSAGE: 'message',
      MEDIA: 'media',
      IMAGE: 'IMAGE',
      VIDEO: 'VIDEO',
      AUDIO: 'AUDIO',
      DOC: 'DOC',
      TAG: 'TAG',
      artifactAudio: [
        'audio/aac',
        'audio/x-m4a',
        'audio/mp3',
        'audio/amr',
        'audio/ogg',
      ],
      artifactImg: ['image/jpeg', 'image/jpg', 'image/png'],
      artifactVideo: ['video/mp4'],
      artifactDoc: [
        'application/pdf',
        'application/doc',
        'application/docx',
        'application/ppt',
        'application/pptx',
        'application/xls',
        'application/xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ],
    },
  },
};

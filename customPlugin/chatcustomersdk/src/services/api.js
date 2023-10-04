import Variables from '../utils/variables';


let myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append('authentication-token', Variables.TOKEN);

export async function activeChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.ACTIVE_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}



export async function suspendedChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.SUSPENDED_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function closedChats() {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + Variables.CLOSED_CHATS;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function checkTokenApi() {
  return new Promise((resolve, reject) => {
    var url =   Variables.API_URL + '/c/enterprises/' + Variables.EID + '/services'
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      //console.log("chektoken api res--> ",xhr);
      if (xhr.status === 200) {
        // const data = JSON.parse(xhr.responseText);
        // console.log('Api success-->', JSON.stringify(data));
        // console.log('Api success', data.data.broadcastList);
        resolve(true);
      } else {
        console.log('Api Status', xhr.statusText);
        resolve(false);
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}



export async function registerApi(mobileNumber,cCode,eId) {
  console.log("register token call 3");
data = {
  'name': mobileNumber,
  'phoneNumber': mobileNumber,
  'countryCode': cCode,
  'countryAlpha2Code': 'IN',
  'needVerification': 'false',
  'byInvitation': 'false',
  'subscribeToAll': 'true',
  'enterprisesToSubscribe': JSON.stringify({"eIds":[eId]}),
  'clearMsgs': 'true' 
};
  var body = Object.keys(data)
  .map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  })
  .join('&');
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/account/customer/register';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url,true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error',JSON.stringify(xhr));
      reject(new Error('Network error'));
    };
    console.log(body);
    xhr.send(body);
  });
}
export async function chatCreationApi(eId) {
  console.log('chatCreationApi call-->', eId);
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/c/enterprises/' + eId + '/chat/create';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
export async function getChatInfo(eId,chatId) {
  console.log('inner call');

  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/c/enterprises/'+eId+'/chat/'+chatId;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success', data.response);
        //response.chat.state 0-unpicked 3-closed
        resolve(data.response);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
export async function getBroadCastList() {
  return new Promise((resolve, reject) => {
    var url =
      'https://qa.twixor.digital/moc/chatbird/api/broadcast?name=&from=0&perPage=20&fromDate=2023-03-07T18:30:00.000Z&toDate=2023-03-15T18:29:00.000Z';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success-->', JSON.stringify(data));
        console.log('Api success', data.data.broadcastList);
        resolve(data.data.broadcastList);
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

function ApiRequest(url, method, header) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = e => {
    if (request.readyState !== 4) {
      return;
    }

    if (request.status === 200) {
      console.log('success', request.responseText);
      return request.responseText;
    } else {
      console.warn('error');
    }
  };

  request.open(method);
  request.setRequestHeader(header);
  request.send();
}

export async function getChannelList() {
  console.log('inner call');
  return new Promise((resolve, reject) => {
    var url =
      Variables.API_URL +
      '/e/enterprise/channels?name=&type=4&from=0&perPage=20';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data.response.channelConfig) {
          resolve(data.response.channelConfig);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}
export async function getTemplateList(channelId) {
  console.log('inner call');
  return new Promise((resolve, reject) => {
    var url =
      Variables.API_URL +
      '/chatbird/api/templates?channelId=' +
      channelId +
      '&status=APPROVED&page=0';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('template Api success', data);
        if (data.data.templates) {
          resolve(data.data.templates);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

export async function sendTemplateApi(payloadData) {
  console.log('Send call');
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/chatbird/api/broadcast';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('template Api success', data);
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    var testPayload = {
      channelId: '6152e73f516075157c2ee3f2',
      phoneNumber: ['918190083902'],
      message: {
        template: {
          templateId: 'karix_survey',
          templateUId: 2127923597404786,
          media: {
            type: 'IMAGE',
            url: 'https://qa.twixor.digital/moc/drive/docs/641808be725d0417bb2315f5',
          },
        },
      },
    };
    var payload = {
      channelId: payloadData.channelValue,
      phoneNumber: payloadData.mobileNumbers,
      message: {
        template: {
          templateId: payloadData.templateValue.name,
          templateUId: payloadData.templateValue.templateId,
          // "media": {
          //     "type": "IMAGE",
          //     "url": "https://qa.twixor.digital/moc/drive/docs/641808be725d0417bb2315f5"
          // }
        },
      },
    };
    console.log('Payload', JSON.stringify(payload));
    xhr.send(JSON.stringify(payload));
  });
}

export async function closeChat(chatId) {
  console.log('Close call-->', chatId);
  return new Promise((resolve, reject) => {
    var url = Variables.API_URL + '/e/enterprise/chat/' + chatId + '/close';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('authentication-token', Variables.TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        console.log('Api success');
        if (data) {
          resolve(data);
        } else {
          resolve([]);
        }
      } else {
        console.log('Api Status', xhr.statusText);
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = () => {
      console.log('Api Error');
      reject(new Error('Network error'));
    };
    xhr.send();
  });
}

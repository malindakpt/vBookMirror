function getStringFromHash (s) {
  let res = '';
  while (s && s.length > 0) {
    const code = Number(s.substr(0, 3)) - 103;
    res = res + String.fromCharCode(code);
    s = s.substr(3);
  }
  return res;
};

(function () {
  var testTool = window.testTool;
  // get meeting args from url
  var tmpArgs = testTool.parseQuery();

  tmpArgs.pwd = getStringFromHash(tmpArgs.pwd);


  var meetingConfig = {
    apiKey: tmpArgs.apiKey,
    meetingNumber: tmpArgs.mn,
    userName: (function () {
      if (tmpArgs.name) {
        try {
          return testTool.b64DecodeUnicode(tmpArgs.name);
        } catch (e) {
          return tmpArgs.name;
        }
      }
      return (
        "CDN#" +
        tmpArgs.version +
        "#" +
        testTool.detectOS() +
        "#" +
        testTool.getBrowserInfo()
      );
    })(),
    passWord: tmpArgs.pwd,
    leaveUrl: "/index.html",
    role: parseInt(tmpArgs.role, 10),
    userEmail: (function () {
      try {
        return testTool.b64DecodeUnicode(tmpArgs.email);
      } catch (e) {
        return tmpArgs.email;
      }
    })(),
    lang: tmpArgs.lang,
    signature: tmpArgs.signature || "",
    china: tmpArgs.china === "1",
  };

  // a tool use debug mobile device
  if (testTool.isMobileDevice()) {
   // vConsole = new VConsole();
  }
  console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

  // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
  // ZoomMtg.setZoomJSLib("https://source.zoom.us/1.8.1/lib", "/av"); // CDN version defaul
  if (meetingConfig.china)
    ZoomMtg.setZoomJSLib("https://jssdk.zoomus.cn/1.8.1/lib", "/av"); // china cdn option
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();
    function beginJoin(signature) {
      ZoomMtg.init({
        leaveUrl: meetingConfig.leaveUrl,
        webEndpoint: meetingConfig.webEndpoint,
        success: function () {
          // $.i18n.reload(meetingConfig.lang);
          setTimeout(() => {
            $('.joinWindowBtn').click();
            console.log('Joined')
          }, 1000);
          ZoomMtg.join({
            meetingNumber: meetingConfig.meetingNumber,
            userName: meetingConfig.userName,
            signature: signature,
            apiKey: meetingConfig.apiKey,
            userEmail: meetingConfig.userEmail,
            passWord: meetingConfig.passWord,
            success: function (res) {
              console.log("join meeting success");
              console.log("get attendeelist");
              ZoomMtg.getAttendeeslist({
                success: function (res) {
                  window.parent.postMessage({type: 'CONNECT', data: res} , '*');
                },
              });
              ZoomMtg.getCurrentUser({
                success: function (res) {
                  console.log("success getCurrentUser", res.result.currentUser);
                },
              });
            },
            error: function (res) {
              console.log(res);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });

    ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
      
      console.log('mkpt inMeetingServiceListener onUserJoin', data);
      // window.parent.postMessage({ message: 'getAppData', value: {type: 'JOIN', data: data} }, '*');
      window.parent.postMessage({type: 'JOIN', data: data} , '*');

     
      var ele1 = document.getElementsByClassName('meeting-info-icon__icon');
      var ele2 = document.getElementsByClassName('e2e-encryption-indicator__encrypt-indicator e2e-encryption-indicator__encrypt-indicator--2');
      
      if (ele1 && ele1.length > 0) {
        ele1[0].parentElement.removeChild(ele1[0]);
      }
      if (ele2 && ele2.length > 0) {
        ele2[0].parentElement.removeChild(ele2[0]);
      }
    });
  
    ZoomMtg.inMeetingServiceListener('onUserLeave', function (data) {
      console.log('inMeetingServiceListener onUserLeave', data);
      window.parent.postMessage({type: 'LEAVE', data: data} , '*');
    });
  
    ZoomMtg.inMeetingServiceListener('onUserIsInWaitingRoom', function (data) {
      console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
    });
  
    ZoomMtg.inMeetingServiceListener('onMeetingStatus', function (data) {
      console.log('inMeetingServiceListener onMeetingStatus', data);
    });
  }

  beginJoin(meetingConfig.signature);


})();

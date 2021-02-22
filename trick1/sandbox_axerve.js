if (typeof axerve === 'undefined'){
    var axerve = {};
    axerve.lightBox = {};
}
axerve.lightBox.shop = '';
axerve.lightBox.paymentID = '';
axerve.lightBox.paymentToken = '';
axerve.lightBox.AbsUrl = 'https://sandbox.gestpay.net/pagam/src/index.html';
//axerve.lightBox.AbsUrl = 'http://localhost:4200/index.html';
axerve.lightBox.responseType = '';
axerve.lightBox.response = {
    error: {
        code: '',
        description: ''
    },
    payLoad: {}
};
axerve.lightBox.check = function () {
    if (axerve.lightBox.HTMLElement)
        return true;
    else
        return false;
}

axerve.mobile = {};
axerve.mobile.AbsUrl = 'https://sandbox.gestpay.net/pagam/src/index.html';
//axerve.mobile.AbsUrl = 'http://localhost:4200/index.html';

axerve.debug;

var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() || screen.width < 500);
    }
};
function IsIOSafari() {
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
   // if (isSafari && iOS) {
	   if (isMobile.any()) {
        return true;
    } else 
		return false;
    
}
axerve.lightBox.IsiOS=IsIOSafari(); 
axerve.lightBox.requestType = (isMobile.any()) ? 'Mobile' : 'Desktop';

axerve.lightBox.open = function (paymentID, paymentToken, callBackObj,windowReferenceObj) {
    axerve.lightBox.paymentID = paymentID;
    axerve.lightBox.paymentToken = paymentToken;
    if (!(typeof callBackObj === 'undefined')) {
	    axerve.lightBox.responseType = 'callBack';
        axerve.lightBox.open.callBackObj = callBackObj;
    }
    else {
	    if (axerve.debug) console.log('[Axerve.JS] Call Back Object is Invalid or Null');
        axerve.lightBox.responseType = 'redirect';
    }
    if (paymentToken != null || paymentToken != undefined) {
        if (paymentToken.length > 0) {
            if(axerve.lightBox.HTMLElement != null) {
                if(confirm('Payment under process. Click OK to abort current Payment and start new Payment.')) {
                    closeLightBox();
                    openlightBox();
                } else {
                    console.log('continue');
                }
            } else {
              openlightBox();
            }
        }
        else {
            if (axerve.debug) console.log('[Axerve.JS] paymentToken is empty or Null');
            if (!(typeof callBackObj === 'undefined')) {
                axerve.lightBox.response.error.code = '1134';
                axerve.lightBox.response.error.description = 'Not accepted call: empty parameter paymentToken';
                axerve.lightBox.response.payLoad = null;
                axerve.lightBox.open.callBackObj(axerve.lightBox.response);
            }
        }
    }
    else {
        if (axerve.debug) console.log('[Axerve.JS] paymentToken is empty or Null');
        if (!(typeof callBackObj === 'undefined')) {
            axerve.lightBox.response.error.code = '1134';
            axerve.lightBox.response.error.description = 'Not accepted call: empty parameter paymentToken';
            axerve.lightBox.response.payLoad = null;
            axerve.lightBox.open.callBackObj(axerve.lightBox.response);
        }
    }
}

function openlightBox() {
    try {
        if (axerve.debug) console.log('[Axerve.JS] Opening Lightbox');
        var iFrame = createiFrame();
        axerve.lightBox.URL = axerve.lightBox.AbsUrl + '?paymentID=' + encodeURIComponent(axerve.lightBox.paymentID) + '&paymentToken=' + encodeURIComponent(axerve.lightBox.paymentToken) + '&shopLogin=' + encodeURIComponent(axerve.lightBox.shop) + '&lightBox=true';
        if (iFrame) {
            axerve.lightBox.iFrame.src = axerve.lightBox.URL;
            //axerve.lightBox.hiddenBtn.click();
			axerve.lightBox.HTMLElement.style = 'visibility:visible';
        }
        else {
            if (axerve.debug) console.log('[Axerve.JS] Error Creating Iframe');
            if (!(typeof callBackObj === 'undefined')) {
                axerve.lightBox.response.error.code = '9992';
                axerve.lightBox.response.error.description = 'Error Creating Iframe';
                axerve.lightBox.response.payLoad = null;
                axerve.lightBox.open.callBackObj(axerve.lightBox.response);
            }
        }
    }
    catch(err) {
        if (axerve.debug) console.log('[Axerve.JS] Lightbox Payment page cannot be opened');
        if (!(typeof callBackObj === 'undefined')) {
            axerve.lightBox.response.error.code = '9991';
            axerve.lightBox.response.error.description = 'Browser Not Supported';
            axerve.lightBox.response.payLoad = null;
            axerve.lightBox.open.callBackObj(axerve.lightBox.response);
        }
    }
}

if (window.addEventListener) {
    window.addEventListener('message', receiver, false);
} else if (window.attachEvent) {
    window.attachEvent("onmessage", receiver);
}

function receiver(e) {
    
	if (axerve.debug) console.log('[Axerve.JS] Got message from Payment Page');
	
    var response = (e.data != null || e.data != undefined) ? JSON.parse(e.data) : null;
	console.log(response);
	if(response['status'] == 'hide') axerve.lightBox.HTMLElement.style.display = 'none';
	else if(response['status'] == 'show') axerve.lightBox.HTMLElement.style.display = 'block';
	else 
	{
		
		closeLightBox();
		if (axerve.lightBox.responseType == 'callBack')
			axerve.lightBox.open.callBackObj(response);
		else {
			if (response['responseURL'] != null || response['responseURL'] != undefined)
				window.location.replace(response['responseURL']);
		}
	} 
}

function closeLightBox() {
if(axerve.lightBox.HTMLElement!=null && axerve.lightBox.HTMLElement!=undefined)
{
	axerve.lightBox.HTMLElement.parentNode.removeChild(axerve.lightBox.HTMLElement);
	axerve.lightBox.hiddenBtn.parentNode.removeChild(axerve.lightBox.hiddenBtn);
	axerve.lightBox.HTMLElement = null;
	axerve.lightBox.hiddenBtn = null;
}
}

function createiFrame() {
    try {
        createLightBoxContainer();
        createIframe();
        if (axerve.lightBox.requestType == 'Desktop') {
            createLightBoxFooter();
            addLightBoxStyles();
        } else {
            addLightBoxStylesMobile();
        }
        return true;
    }
    catch(err){
        return false;
    }
}
function createLightBoxContainer() {
    axerve.lightBox.HTMLElement = document.createElement('div');
    axerve.lightBox.HTMLElement.id = 'axerve_lightBox';
    axerve.lightBox.HTMLElement.className = 'overlay';
    document.getElementsByTagName('body')[0].appendChild(axerve.lightBox.HTMLElement);
    createLightBoxHiddenBtn();
    if (axerve.lightBox.requestType == 'Desktop') {
        axerve.lightBox.iFrmContainer = document.createElement('div');
        axerve.lightBox.iFrmContainer.id = 'axerve_lightBox_Container';
        axerve.lightBox.iFrmContainer.className = 'lightBox_Container';
        axerve.lightBox.HTMLElement.appendChild(axerve.lightBox.iFrmContainer);
    } else {
        axerve.lightBox.iFrmContainer = axerve.lightBox.HTMLElement;
    }
}
function createIframe() {
    axerve.lightBox.iFrame = document.createElement("iframe");
    axerve.lightBox.iFrame.src = axerve.lightBox.URL;
    axerve.lightBox.iFrame.id = 'lightBox_Iframe';
    axerve.lightBox.iFrame.className = "ifrm";
    axerve.lightBox.iFrmContainer.appendChild(axerve.lightBox.iFrame);
}
function createLightBoxFooter() {
    axerve.lightBox.footer = document.createElement('div');
    axerve.lightBox.footer.id = 'axerve_lightBox_footer';
    axerve.lightBox.footer.className = 'footerDiv';
    axerve.lightBox.footer.innerHTML = '<div class="footerImg"> <label><img src="https://sandbox.gestpay.net/pagam/src/assets/images/outline_lock_white_18dp.png" /></label> </div> <div class="footerlbl"> <label>Powered by Axerve | Sella</label> </div>';
    axerve.lightBox.iFrmContainer.appendChild(axerve.lightBox.footer);
}
function addLightBoxStyles() {
    var docStyles = document.createElement('style');
    docStyles.type = 'text/css';
    var css = '.overlay { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); visibility: hidden; } .overlay:target { visibility: visible; opacity: 1; } .lightBox_Container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } .footerDiv { font-family: "Helvetica Neue" ,Helvetica,Arial,sans-serif; margin-top:2%; justify-content:center; display:flex; } .footerImg { margin-top:0px; margin-right:10px; height:10px; } .footerlbl { font-weight: 400; font-size: 15px; color: white; } .ifrm { border:0px; border-radius:10px; height: 665px; width: 400px; min-height: 665px; max-height: 693px; overflow:hidden; background-color:white; }';
    docStyles.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(docStyles);
}
function addLightBoxStylesMobile() {
    var docStyles = document.createElement('style');
    docStyles.type = 'text/css';
    var css = '.overlay { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); visibility: hidden; overflow:auto; } .overlay:target { visibility: visible; opacity: 1; } .lightBox_Container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } .footerDiv { font-family: "Helvetica Neue" ,Helvetica,Arial,sans-serif; margin-top:2%; justify-content:center; display:flex; } .footerImg { margin-top:0px; margin-right:10px; height:10px; } .footerlbl { font-weight: 400; font-size: 15px; color: white; } .ifrm { border:0px; border-radius:10px; height: 665px; width: 100%; min-height: 665px; max-height: 693px; overflow:auto; background-color:white; }';
    docStyles.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(docStyles);
}
function createLightBoxHiddenBtn() {
    axerve.lightBox.hiddenBtn = document.createElement('a');
    axerve.lightBox.hiddenBtn.id = 'axerve_lightBox_hiddenBtn';
    axerve.lightBox.hiddenBtn.style = 'display:none';
    axerve.lightBox.hiddenBtn.href = '#axerve_lightBox';
    document.getElementsByTagName('body')[0].appendChild(axerve.lightBox.hiddenBtn);
}

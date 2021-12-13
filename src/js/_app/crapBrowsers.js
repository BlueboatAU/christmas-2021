export const crapBrowsers = () => {

    if (/MSIE 10/i.test(navigator.userAgent)) {
        // This is internet explorer 10
        window.alert('isIE10');
     }
     
     if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
         // This is internet explorer 9 or 11
         window.location = 'pages/core/ie.htm';
     }
     
     if (/Edge\/\d./i.test(navigator.userAgent)){
        // This is Microsoft Edge
        window.alert('Microsoft Edge');
     }

}
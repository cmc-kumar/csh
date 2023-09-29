/**
 * Created by zhubq on 5/25/15.
 */
/**
 * use browser print
 * @param printContent
 */
function browserPrint(printContent,frameStyle){
  if(undefined === frameStyle || '' === frameStyle){
    frameStyle = 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;';
  }
  var iFrame = document.createElement('IFRAME');
  iFrame.setAttribute('style', frameStyle);
  document.body.appendChild(iFrame);
  var doc = iFrame.contentWindow.document;
  doc.write(printContent);
  doc.close();
  iFrame.contentWindow.focus();
  iFrame.contentWindow.print();
  if (navigator.userAgent.indexOf("MSIE") > 0) {
    document.body.removeChild(iFrame);
  }
}
/**
 * check is integer when enter char
 * @param evt
 * @returns {boolean}
 */
function isIntegerKey(evt) {
  var charCode = (evt.which) ? evt.which : event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
}
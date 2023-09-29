/**
 * prevent XFS Attack
 */
window.onload = function(){
  if (top.frames.length!=0) {
    top.location = self.document.location;
  }
}
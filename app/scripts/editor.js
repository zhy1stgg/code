
/**
 * select content when input and textarea clicked in tip
 * @param  {[type]} ){               $(this).select();} [description]
 * @return {[type]}     [description]
 */
$(".tip input,.tip textarea").click(function(){
  $(this).select();
});


/**
 * 阻止Tip内容区域点击关闭  tip
 * @param  {[type]} ){               return false;} [description]
 * @return {[type]}     [description]
 */
$(".tip-content").click(function(){
  return false;
});


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


/**
 * 侧边栏点击切换
 */

$(".sider-title").click(function(){
  var siderList = $(this).parent();
  if(siderList.hasClass("active")) {
    return;
  }

  var currentList = $("#sider").find(".active");

  currentList.find(".sider-content").slideUp();
   currentList.removeClass("active");


   siderList.addClass("active");
  siderList.find(".sider-content").slideDown();

});

var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function(document){var metas=document.getElementsByTagName("meta"),changeViewportContent=function(content){for(var i=0;i<metas.length;i++){if(metas[i].name=="viewport"){metas[i].content=content}}},initialize=function(){changeViewportContent("width=device-width, minimum-scale=1.0, maximum-scale=1.0")},gestureStart=function(){changeViewportContent("width=device-width, minimum-scale=0.25, maximum-scale=1.6")},gestureEnd=function(){initialize()};if(navigator.userAgent.match(/iPhone/i)){initialize();document.addEventListener("touchstart",gestureStart,false);document.addEventListener("touchend",gestureEnd,false)}})(document);


}

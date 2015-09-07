document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        setTimeout(function() {
            document.getElementById('content').removeChild(document.getElementById("loader"));
            run();
        }, 2000);
        // document.getElementsByTagName("body")[0].removeChild(document.getElementById("loading"));
        // setTimeout(run, 200);
    }
}


/**
 * select content when input and textarea clicked in tip
 * @param  {[type]} ){               $(this).select();} [description]
 * @return {[type]}     [description]
 */
$(".tip input,.tip textarea").click(function() {
    $(this).select();
});


/**
 * 阻止Tip内容区域点击关闭  tip
 * @param  {[type]} ){               return false;} [description]
 * @return {[type]}     [description]
 */
$(".tip-content").click(function() {
    return false;
});

// $(".tip-content").find("label").click(function() {
//     jQuery(this).find("input[type='checkbox']").prop('checked', true);
// });


/**
 * 侧边栏点击切换
 */

$(".sider-title").click(function() {
    var siderList = $(this).parent();
    if (siderList.hasClass("active")) {
        return;
    }

    var currentList = $("#sider").find(".active");

    currentList.find(".sider-content").slideUp();
    currentList.removeClass("active");


    siderList.addClass("active");
    siderList.find(".sider-content").slideDown();

});







//
var horizontal_hands = Array.prototype.slice.call(document.getElementsByClassName('handler_horizontal'));
var vertical_hand = document.getElementsByClassName('handler_vertical')[0];
var contentEl = document.getElementById('content');
var leftEl = document.getElementsByClassName('left')[0];
var rightEl = document.getElementsByClassName('right')[0];


/**
 * 编辑器拖动范围
 * @type {Object}
 */
var zoomMax = {
    min: {
        x: 400,
        y: 200
    },
    max: {
        x: 1000,
        y: 500
    }
};

/**
 * Content 自适应
 */
function setContentArea() {
    zoomMax.max.y = (document.documentElement.clientHeight - 44 - 14 * 2 - 100);
    zoomMax.max.x = (document.documentElement.clientWidth - 200);
    contentEl.style.height = (document.documentElement.clientHeight - 44 - 14 * 2) + 'px';
}

setContentArea();
addEvent(window, 'resize', setContentArea);


horizontal_hands.forEach(function(hand, i) {

    var topEl = hand.parentElement.getElementsByClassName('top')[0];
    var botEl = hand.parentElement.getElementsByClassName('bottom')[0];
    barDragger('y', hand, contentEl, topEl, botEl,
        function(el) {
            el.parentElement.getElementsByClassName('shim')[0].style.display = 'block';
        },
        null,
        function(el) {
            el.parentElement.getElementsByClassName('shim')[0].style.display = 'none';
        },
        i
    );
});




barDragger('x', vertical_hand, contentEl, leftEl, rightEl,
    function(el) {
        leftEl.getElementsByClassName('shim')[0].style.display = 'block';
        rightEl.getElementsByClassName('shim')[0].style.display = 'block';
    },
    null,
    function(el) {
        leftEl.getElementsByClassName('shim')[0].style.display = 'none';
        rightEl.getElementsByClassName('shim')[0].style.display = 'none';
    }, 2
);



/**
 * 定义编辑器参数
 * @type {Array}
 */
var editors = [{
    name: 'html',
    mode: 'text/html',
    obj: null
}, {
    name: 'css',
    mode: 'text/css',
    obj: null
}, {
    name: 'js',
    mode: {
        name: 'javascript',
        alignCDATA: true
    },
    obj: null
}];

var resultTemplate = _.template(document.getElementById('reuslt-template').innerHTML);



/**
 * 初始化编辑器
 */
_.each(editors, function(e) {
    e.obj = CodeMirror.fromTextArea(document.getElementById('code_' + e.name), {
        mode: e.mode,
        lineNumbers: true,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        showCursorWhenSelecting: true,
        tabindex: 4,
        indentUnit: 4,
        extraKeys: {
            'Ctrl-Enter': function() {
                console.log(e.name + " Ctrl");
            },

            "F11": function(cm) {
                console.log("F11");
                return;
                setFullScreen(cm, !isFullScreen(cm));
            },
            "Esc": function(cm) {
                if (isFullScreen(cm)) setFullScreen(cm, false);
            }
        }
    });

    if (e.obj) {
        e.obj.on('focus', function() {
            $("#panel_" + e.name).find('.window_label').hide();
        });

        e.obj.on('blur', function() {
            $("#panel_" + e.name).find('.window_label').show();
        });
    }
});


function addEvent(oTarget, eventType, listener) {
    if (oTarget.addEventListener) {
        oTarget.addEventListener(eventType, listener, false);
    } else if (oTarget.attachEvent) {
        oTarget['e' + eventType + listener] = listener;
        oTarget[eventType + listener] = function() {
            oTarget['e' + eventType + listener](window.event);
        };
        oTarget.attachEvent('on' + eventType, oTarget[eventType + listener]);
    }
};

function removeEvent(oTarget, eventType, listener) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(eventType, listener, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent('on' + eventType, oTarget[eventType + listener]);
        delete oTarget[eventType + listener];
        delete oTarget['e' + eventType + listener];
    }
};




function barDragger(axis, barEl, contentEl, firstEl, lastEl, startfn, dragfn, stopfn, index) {

    var PRO_WH = (axis === 'x') ? 'width' : 'height';
    var PRO_LT = (axis === 'x') ? 'left' : 'top';
    var HALF_BAR_WIDTH = (axis === 'x') ? barEl.clientWidth / 3.0 : barEl.clientHeight / 3.0;

    var MIN_LEN_LIMIT = 100.0 + HALF_BAR_WIDTH;
    var contentMeasure = function() {
        return (axis === 'x') ? contentEl.clientWidth : contentEl.clientHeight;
    };

    var firstPercent;

    function initContent() {

        document.getElementById("content").style.width = (document.body.clientWidth - 228) + "px";

        var b = layout[index];
        barEl.style[PRO_LT] = (contentMeasure() * b - HALF_BAR_WIDTH) + 'px';

        adjustContent(contentMeasure() * b);
    }

    addEvent(window, 'load', initContent);

    function resizeContent() {
        document.getElementById("content").style.width = (document.body.clientWidth - 228) + "px";
        var _firstPercent = firstEl.style[PRO_WH].replace('%', '');

        var _firstMeasure = contentMeasure() * _firstPercent / 100;

        barEl.style[PRO_LT] = (_firstMeasure - HALF_BAR_WIDTH) + 'px';
        adjustContent(_firstMeasure);
    }
    addEvent(window, 'resize', resizeContent);

    function adjustContent(firstMeasure) {

        var _firstPercent = firstMeasure / contentMeasure() * 100;
        // _firstPercent = 40;
        firstEl.style[PRO_WH] = _firstPercent + '%';
        lastEl.style[PRO_WH] = (100 - _firstPercent) + '%';
    }

    function _startfn(el, evt) {
        firstPercent = firstEl.style[PRO_WH].replace('%', '') || 50;

        if (startfn) startfn(el, evt);
    }

    function _dragfn(el, diff, evt) {
        // var _elPos=parseFloat(el.style[PRO_LT]);
        // if(_elPos<MIN_LEN_LIMIT- HALF_BAR_WIDTH  || _elPos>(contentMeasure()-MIN_LEN_LIMIT-HALF_BAR_WIDTH ))
        //     return false;

        var _firstMeasure = (contentMeasure() * firstPercent) / 100 + diff[axis];

        adjustContent(_firstMeasure);

        if (dragfn) dragfn(el, diff, evt);
        return true;
    }

    function _stopfn(el, evt) {
        var _elPos = parseFloat(el.style[PRO_LT]);
        if (_elPos < MIN_LEN_LIMIT - HALF_BAR_WIDTH) {
            el.style[PRO_LT] = (MIN_LEN_LIMIT - HALF_BAR_WIDTH) + 'px';
            adjustContent(MIN_LEN_LIMIT);
        } else if (_elPos > (contentMeasure() - MIN_LEN_LIMIT - HALF_BAR_WIDTH)) {
            el.style[PRO_LT] = (contentMeasure() - MIN_LEN_LIMIT - HALF_BAR_WIDTH) + 'px';
            adjustContent(contentMeasure() - MIN_LEN_LIMIT);
        }
        if (stopfn) stopfn(el, evt);
    }

    draggable(axis, barEl, _startfn, _dragfn, _stopfn, index);


    // editors[index].height('100%');
}



function draggable(axis, el, startfn, dragfn, stopfn, index) {

    var startMPos, startElPos;

    function m_down(evt) {
        var isMoving = true;
        startMPos = {
            x: evt.clientX,
            y: evt.clientY
        };
        startElPos = {
            top: parseFloat(el.style.top),
            left: parseFloat(el.style.left)
        };
        if (startfn) startfn(el, evt);
        addEvent(window.document, 'mousemove', m_move);
        addEvent(window.document, 'mouseup', m_up);
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }

        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    }

    function m_move(evt) {
        var diff = {
            x: evt.clientX - startMPos.x,
            y: evt.clientY - startMPos.y
        };

        /**
         *  拖动时刷新编辑器
         */
        if (axis === "y") {

            if (index == 0) {
                diff.y > 0 ? editors[2].obj.refresh() : editors[0].obj.refresh();
            } else if (index == 1) {
                if (diff.y < 0) {
                    editors[1].obj.refresh();
                }
            }

        }

        if (zoomMax.min[axis] > evt[axis] || evt[axis] > zoomMax.max[axis]) {
            return;
        }



        if (dragfn && dragfn(el, diff, evt) || !dragfn) {

            if (axis && axis.toLowerCase() === 'x') {
                el.style.left = (startElPos.left + diff.x) + 'px';
            } else if (axis && axis.toLowerCase() === 'y') {
                el.style.top = (startElPos.top + diff.y) + 'px';
            } else {
                el.style.left = (startElPos.left + diff.x) + 'px';
                el.style.top = (startElPos.top + diff.y) + 'px';
            }
        }
    }

    function m_up(evt) {
        var isMoving = false;
        removeEvent(window.document, 'mousemove', m_move);
        removeEvent(window.document, 'mouseup', m_up);
        if (stopfn) stopfn(el, evt);
    }

    addEvent(el, 'mousedown', m_down);
}


function run() {
    var result = {};
    _.each(editors, function(e) {
        // 模板中不能有 </script> 内容，所有 js 代码需要追加
        result[e.name] = e.name === "js" ? e.obj.getValue() + '</script>' : e.obj.getValue();
    });

    var html = resultTemplate(result);

    var result = document.getElementById("result");
    result.innerHTML = "<iframe id=\"ifr\" sandbox=\"allow-forms allow-popups allow-scripts allow-same-origin\"></iframe>";

    var previewFrame = document.getElementById('ifr');

    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    console.log(preview);
    console.log(html);
    preview.open();
    preview.write(html);
    preview.close();

};

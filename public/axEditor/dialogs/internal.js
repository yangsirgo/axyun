var isLeftBarMode = 0;//侧边栏模式 与其对应的是弹窗模式 初始为false
(function () {
    var parent = window.parent;
    //dialog对象
    if(window.frameElement.id.replace( /_iframe$/, '' )) {//弹窗模式
        dialog = parent.$EDITORUI[window.frameElement.id.replace( /_iframe$/, '' )];
        isLeftBarMode = 0;
    } else {//侧边栏模式
        dialog = undefined;
        isLeftBarMode = 1;
    }

    //当前打开dialog的编辑器实例
    editor = dialog ? dialog.editor : parent.axeditor;

    AX = parent.AX;

    domUtils = AX.dom.domUtils;

    utils = AX.utils;

    browser = AX.browser;

    ajax = AX.ajax;

    $G = function ( id ) {
        return document.getElementById( id )
    };
    //focus元素
    $focus = function ( node ) {
        setTimeout( function () {
            if ( browser.ie ) {
                var r = node.createTextRange();
                r.collapse( false );
                r.select();
            } else {
                node.focus()
            }
        }, 0 )
    };
    // utils.loadFile(document,{
    //     href:editor.options.themePath + editor.options.theme + "/dialogbase.css?cache="+Math.random(),
    //     tag:"link",
    //     type:"text/css",
    //     rel:"stylesheet"
    // });
    lang = editor.getLang(dialog ? dialog.className.split( "-" )[2] : "spechars");
    if(lang){
        domUtils.on(window,'load',function () {

            var langImgPath = editor.options.langPath + editor.options.lang + "/images/";
            //针对静态资源
            for ( var i in lang["static"] ) {
                var dom = $G( i );
                if(!dom) continue;
                var tagName = dom.tagName,
                    content = lang["static"][i];
                if(content.src){
                    //clone
                    content = utils.extend({},content,false);
                    content.src = langImgPath + content.src;
                }
                if(content.style){
                    content = utils.extend({},content,false);
                    content.style = content.style.replace(/url\s*\(/g,"url(" + langImgPath)
                }
                switch ( tagName.toLowerCase() ) {
                    case "var":
                        dom.parentNode.replaceChild( document.createTextNode( content ), dom );
                        break;
                    case "select":
                        var ops = dom.options;
                        for ( var j = 0, oj; oj = ops[j]; ) {
                            oj.innerHTML = content.options[j++];
                        }
                        for ( var p in content ) {
                            p != "options" && dom.setAttribute( p, content[p] );
                        }
                        break;
                    default :
                        domUtils.setAttributes( dom, content);
                }
            }
        } );
    }

    window.createElement = function(type, name) {
        var element = null;
        try {
            element = document.createElement(type);
            if (element) {
                element.id = name;
            }
        } catch (e) {}
        if (element == null) {
            element = document.createElement(type);
            element.name = name;
        }
        return element;
    }
})();


//
// jQuery分页插件
// 
// Guo Sheng @2016 778170336@qq.com
// 

; // 防止合并脚本时前面的代码没有分号而导致错误

(function ($, window, document, undefined) {

    $.fn.pagebar = function (settings) {
        return this.each(function () {

            // 默认配置
            var defaultConf = {
                dataCount: 0, // 数据总数量
                pageCapacity: 10, // 每页显示的数据数量
                pageCodeCount: 10 // 显示的页码数量
            };

            // 参数
            var conf = $.extend({}, defaultConf, settings);

            // 总页码
            var totalPage = getTotalPage();

            function getTotalPage() {
                if (conf.dataCount && conf.pageCapacity) {
                    return Math.ceil(conf.dataCount / conf.pageCapacity);
                }
                return 0;
            };


            // 选中的页码
            var selectedPage = 0;
            // 当前显示第几批页码，默认一批10个页码，所处位置为第一批
            var bat = 1;
            // 起始页码
            var startPage = 1;
            // 结束页码
            var endPage = getEndPage();
            // 跳转页码
            var jumpPage = 0;
            // 最大批次
            var maxBat = Math.ceil(totalPage / conf.pageCodeCount);

            function getEndPage() {
                if (totalPage < conf.pageCodeCount) {
                    return totalPage;
                }

                return conf.pageCodeCount;
            }


            // 对象本身，可认为是定义为分页条的那个元素
            var self = $(this);
            // 分页条容器
            var container = document.createElement("ul");
            $(container).css({
                "margin": "0",
                "padding": "0"
            });

            function createClearDiv() {
                var div = document.createElement("div");
                $(div).css({
                    "clear": "both"
                });
                return div;
            }


            // 上翻按钮
            function createUpButton() {
                if (startPage <= 1) {
                    return;
                }

                var upBtn = document.createElement("li");
                $(upBtn).html("<").attr("title", "上翻");
                $(upBtn).addClass("up");
                $(upBtn).css({
                    "float": "left",
                    "list-style": "none",
                    "cursor": "pointer"
                });
                $(upBtn).mouseover(function () {
                    $(this).removeClass("up").addClass("upMouseOver");
                }).mouseout(function () {
                    $(this).removeClass("upMouseOver").addClass("up");
                });
                $(container).append(upBtn);

                $(upBtn).click(function () {
                    endPage = conf.pageCodeCount * (bat - 1);

                    // 值为0时说明为第一批
                    if (endPage == 0) {
                        endPage = conf.pageCodeCount;
                    }

                    startPage = endPage - conf.pageCodeCount + 1;
                    selectedPage = endPage;

                    bat -= 1;
                    if (bat < 1) {
                        bat = 1;
                    }

                    $(container).html("");
                    createPagebar();

                    // 选中最后一个页码
                    var selectedEle = self.find("li.pageCode:last");
                    $(selectedEle).removeClass("pageCode").addClass("pageCodeMouseOver");

                    if (conf.up) {
                        conf.up(selectedPage);
                    }

                });
            }


            // 下翻按钮
            function createDownButton() {
                if (endPage >= totalPage) {
                    return;
                }

                var downBtn = document.createElement("li");
                $(downBtn).html(">").attr("title", "下翻");
                $(downBtn).addClass("down");
                $(downBtn).css({
                    "float": "left",
                    "list-style": "none",
                    "cursor": "pointer"
                });
                $(downBtn).mouseover(function () {
                    $(this).removeClass("down").addClass("downMouseOver");
                }).mouseout(function () {
                    $(this).removeClass("downMouseOver").addClass("down");
                });
                $(container).append(downBtn);

                $(downBtn).click(function () {
                    endPage = conf.pageCodeCount * (bat + 1);
                    startPage = conf.pageCodeCount * bat + 1;
                    selectedPage = startPage;
                    
                    bat += 1;
                    if (bat > maxBat) {
                        bat = maxBat;
                    }
                    
                    if (endPage >= totalPage) {
                        endPage = totalPage;
                    }

                    $(container).html("");

                    createPagebar();

                    // 选中第一个页码
                    var selectedEle = self.find("li.pageCode:first");
                    $(selectedEle).removeClass("pageCode").addClass("pageCodeMouseOver");

                    if (conf.down) {
                        conf.down(selectedPage);
                    }
                });
            }

            // 页码按钮
            function createPageCodeButton() {
                for (var i = startPage; i <= endPage; i++) {
                    var li = document.createElement("li");
                    $(li).append(i);
                    $(li).addClass("pageCode");
                    $(li).css({
                        "float": "left",
                        "list-style": "none",
                        "cursor": "pointer"
                    });

                    if (i > startPage && i <= endPage) {
                        $(li).addClass("pageCodeMargin");
                    }

                    $(li).mouseover(function () {
                        $(this).removeClass("pageCode").addClass("pageCodeMouseOver");
                    }).mouseout(function () {
                        if (selectedPage == $(this).text()) {
                            return;
                        }
                        $(this).removeClass("pageCodeMouseOver").addClass("pageCode");
                    });

                    $(li).click(function () {
                        selectedPage = $(this).text();
                        $(this).removeClass("pageCode").addClass("pageCodeMouseOver");
                        $(this).siblings(".pageCodeMouseOver").removeClass("pageCodeMouseOver").addClass("pageCode");
                        if (conf.select) {
                            conf.select(selectedPage);
                        }
                    });

                    $(container).append(li);
                }
            }

            // 总页数显示面板
            function createTotalPanel() {
                var li = document.createElement("li");
                $(li).html("共" + totalPage + "页");
                $(li).addClass("totalPage");
                $(li).css({
                    "float": "left",
                    "list-style": "none"
                });
                $(container).append(li);
            }

            // 跳转页面板
            function createJumpPanel() {
                var li = document.createElement("li");
                $(li).addClass("jumpText").css({
                    "float": "left",
                    "list-style": "none"
                });
                $(li).html("跳至");
                $(container).append(li);

                var jumpBox = document.createElement("input");
                $(jumpBox).addClass("jumpInputBox");
                li = document.createElement("li");
                $(li).append(jumpBox).css({
                    "float": "left",
                    "list-style": "none"
                });
                $(container).append(li);

                li = document.createElement("li");
                $(li).append("页");
                $(li).addClass("jumpText").css({
                    "float": "left",
                    "list-style": "none"
                });
                $(container).append(li);

                li = document.createElement("li");
                $(li).html("确定").css({
                    "float": "left",
                    "list-style": "none",
                    "cursor": "pointer"
                }).addClass("jumpButton");
                $(li).mouseover(function () {
                    $(this).removeClass("jumpButton").addClass("jumpButtonMouseOver");
                }).mouseout(function () {
                    $(this).removeClass("jumpButtonMouseOver").addClass("jumpButton");
                });
                $(li).click(function () {
                    var inputBox = self.find("input");
                    jumpPage = parseInt($(inputBox).val());
                    if (!jumpPage || jumpPage <= 0) {
                        alert("请输入正确的跳转页码！");
                        return;
                    }

                    if (jumpPage > totalPage) {
                        jumpPage = totalPage;
                    }

                    $(container).html("");

                    bat = Math.ceil(jumpPage / conf.pageCodeCount);
                    if (bat <= 1) {
                        startPage = 1;
                    } else {
                        startPage = (bat - 1) * conf.pageCodeCount + 1;
                    }

                    endPage = startPage + conf.pageCodeCount - 1;
                    if (endPage > totalPage) {
                        endPage = totalPage;
                    }

                    selectedPage = jumpPage;

                    createPagebar();

                    self.find(".pageCode").each(function () {
                        if ($(this).text() == selectedPage) {
                            $(this).removeClass("pageCode").addClass("pageCodeMouseOver");
                        }
                    });

                    if (conf.jump) {
                        conf.jump(jumpPage);
                    }
                });

                $(container).append(li);
            }


            // 创建分页条
            function createPagebar() {

                // 注意调用顺序
                createUpButton();
                createPageCodeButton();
                createDownButton();
                createTotalPanel();
                createJumpPanel();

                // 清除浮动，使父元素被子元素撑开
                $(container).append(createClearDiv());
                self.append(container);
            }

            // 调用，创建分页条
            createPagebar();
        });
    };

})(jQuery, window, document);
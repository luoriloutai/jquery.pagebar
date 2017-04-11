使用方法：
	
	引用文件：
	<script src="pagebar/jquery-1.12.1.min.js"></script>
    <link href="pagebar/jquery.pagebar.css" rel="stylesheet" />
    <script src="pagebar/jquery.pagebar.js"></script>

	使用：
    <script>
        $(function () {
            $("#pagebar").pagebar({
				// 点击“上翻”后的操作
                up: function (selectedPage) {
                    alert("up:"+selectedPage);
                },
				// 点击“下翻”后的操作
                down:function(selectedPage){
                    alert("down:"+selectedPage);
                },
				// 点击页码选择后的操作
                select:function(selectedPage){
                    alert("select:"+selectedPage);
                },
				// 跳转后的操作
                jump: function (jumpPage) {
                    alert(jumpPage);
                },
                dataCount: 300,			 // 数据总数量
                pageCapacity: 10,        // 每页显示的数据数量
                pageCodeCount: 10        // 显示的页码数量
            });
        })
    </script>

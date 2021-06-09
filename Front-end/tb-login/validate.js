$(document).ready(function ($) {
	function validate($dom) {
		let flag = true;
		let id = $dom.attr("id");
		let v = $dom.val();
		let errorInfo = "";
		switch (id) {
			case "user":
				let reg1 = /^[a-zA-Z0-9]{4,8}$/;
				if (v == "") {
					alert("用户名不能为空");
					flag = false;
				} else if (!reg1.test(v)) {
					alert("长度在4-8位之间");
					flag = false;
				}
				break;

			case "pwd":
				let reg2 = /^[a-zA-Z0-9]{6,}$/;
				if (v == "") {
					alert("密码不能为空");
					flag = false;
				} else if (!reg2.test(v)) {
					alert("密码长度要大于6位");
					flag = false;
				}
				break;
			default:
				break;
		}
		return flag;
	}

	//绑定事件
	$("#user").bind({
		blur: function () {
			validate($(this));
		},
	});
	$("#pwd").bind({
		blur: function () {
			validate($(this));
		},
	});

	//页面跳转
	// $("button#login-btn").click(function () {
	// 	window.location.href = "main.html";
	// });
});

const axios = require("axios");
const fs = require("fs");
const prompts = require("prompts");

const interval = 100;
// 返回token
async function getToken(user) {
	const loginUrl = "https://as.hypergryph.com/user/auth/v1/token_by_phone_password";
	try {
		let res = await axios({
			method: "POST",
			url: loginUrl,
			data: {
				password: user.password,
				phone: user.phone,
			},
		});
		// 判断是否成功获取
		if (res.data.status === 0) {
			let token = res.data.data.token;
			console.log("token:" + token);
			return token;
		} else {
			console.log(res.data.msg);
			return false;
		}
	} catch (error) {
		console.log("获取token出错！");
		return false;
	}
}
// 返回用户相关信息
async function getUserInfo(token) {
	const userUrl = "https://as.hypergryph.com/u8/user/info/v1/basic";
	try {
		let res = await axios({
			url: userUrl,
			method: "POST",
			data: {
				appId: 1,
				channelMasterId: 1,
				channelToken: {
					token: token,
				},
			},
		});
		let nickName = res.data.data.nickName;
		console.log(nickName);
		return nickName;
	} catch (error) {
		console.log("获取用户信息出错！");
		return;
	}
}
// 休眠
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
// 返回干员信息
async function getCards(token) {
	let cardList = new Array();
	try {
		for (let i = 1; i < 11; i++) {
			let res = await axios({
				url: "https://ak.hypergryph.com/user/api/inquiry/gacha?page=" + i + "&token=" + token,
				method: "GET",
			});
			if (res.data.code == 3000) {
				console.error("查询失败：", res.data.msg);
				return false;
			}
			// 获取到抽卡数据
			let list = res.data.data.list;
			list.forEach((element) => {
				element.chars.forEach((ele) => {
					let currentCard = {
						pool: element.pool,
						name: ele.name,
						rarity: ele.rarity,
						isNew: ele.isNew,
					};
					// 将当前干员信息插入到数组中
					cardList.push(currentCard);
				});
			});
			// 防止频率太快触发验证
			await sleep(interval);
		}
		// 写入文件
		let nickName = await getUserInfo(token);
		let dataObj = {
			nickName: nickName,
			token: token,
			data: cardList,
		};
		let str = JSON.stringify(dataObj, null, "\t");
		fs.writeFile("arknights.json", str, (err) => {
			if (err) {
				throw err;
			}
		});
		return cardList;
	} catch (error) {
		throw error;
	}
}
async function main() {
	let cardList = new Array();
	if (fs.existsSync("./arknights.json")) {
		let str = fs.readFileSync("./arknights.json", "utf-8");
		cardList = JSON.parse(str).data;
		console.log("读取本地数据！");
	} else {
		let user = await prompts([
			{ type: "text", name: "phone", message: "请输入账号" },
			{ type: "text", name: "password", message: "请输入密码" },
		]);
		let token = await getToken(user);
		if (token) {
			cardList = await getCards(token);
			console.log("已存储数据！");
		} else {
			return;
		}
	}
	let [sixStar, fiveStar, fourStar, threeStar] = [0, 0, 0, 0];
	cardList.forEach((ele) => {
		switch (ele.rarity) {
			case 2:
				threeStar++;
				break;
			case 3:
				fourStar++;
				break;
			case 4:
				fiveStar++;
				break;
			case 5:
				sixStar++;
				break;
		}
	});
	charStr =
		"您已经抽卡" +
		cardList.length +
		"发,其中共有六星角色" +
		sixStar +
		"个,五星角色" +
		fiveStar +
		"个,四星角色" +
		fourStar +
		"个,三星角色" +
		threeStar +
		"个";
	console.log(charStr);
}

main();
// getToken(user);

const axios = require("axios");
const http = require("https");
const cheerio = require("cheerio");
const prompt = require("prompt");

let homeUrl = "https://www.bilibili.com";
let header = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
	cookie: "",
	"sec-ch-ua-platform": "Windows",
};

async function getData() {
	try {
		// 构造request
		let res = await axios({
			url: homeUrl,
			headers: header,
		});
		let $html = res.data;
		let $ = cheerio.load($html);
		let num = 1;
		// 输出内容
		$("h3.bili-video-card__info--tit:lt(6)").each((i, ele) => {
			console.log(num + "." + $(ele).text());
			num++;
		});
	} catch (error) {
		console.log(error);
	}
}
function getFans(uid) {
	if (!uid) {
		uid = "300983155";
	}
	let option = {
		hostname: "api.bilibili.com",
		path:
			"/x/relation/followers?vmid=" +
			uid +
			"&pn=1&ps=20&order=desc&order_type=attention&jsonp=jsonp&callback=__jp5",
		headers: {
			Accept: "*/*",
			"Accept-Encoding": "utf-8", //这里设置返回的编码方式 设置其他的会是乱码
			"Accept-Language": "zh-CN,zh;q=0.8",
			Connection: "keep-alive",
			Cookie: "",
			referer: "https://space.bilibili.com/" + uid + "/fans/fans",
			"sec-fetch-dest": "script",
		},
	};
	http.get(option, (res) => {
		var data = ""; //接口数据

		res.on("data", (chunk) => {
			data += chunk; //拼接数据块
		});
		res.on("end", function () {
			let str = JSON.stringify(data);
			str = str.slice(7);
			str = str.substring(0, str.length - 2);
			str = '"' + str + '"';
			let json = JSON.parse(JSON.parse(str)); //解析json
			json.data.list.forEach((element, i) => {
				console.log(i + 1 + "." + element.uname + " " + element.mid);
			});
		});
	}).on("error", () => console.log("获取数据出错!"));
}

// getData();
prompt.start();
prompt.get(
	{
		properties: {
			id: {
				description: "Please input your bili-uid",
			},
		},
	},
	(err, result) => {
		getFans(result.id);
	}
);

const axios = require("axios");
const http = require("https");
const cheerio = require("cheerio");
const prompt = require("prompts");

let homeUrl = "https://www.bilibili.com";
let header = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55",
	cookie: "buvid3=FB0EC02C-C31F-59B1-D2E2-1DC3DF17048685884infoc; blackside_state=1; rpdid=|(J|)RlYu~~R0J'uYkYl|lkm|; _uuid=D2666F53-C5DC-A8C7-37D3-80A634E8B01938069infoc; LIVE_BUVID=AUTO5716272150598026; buvid_fp=FB0EC02C-C31F-59B1-D2E2-1DC3DF17048685884infoc; buvid_fp_plain=FB0EC02C-C31F-59B1-D2E2-1DC3DF17048685884infoc; CURRENT_QUALITY=0; fingerprint3=c17a4df57b1c97e2b5f9a665207db242; fingerprint_s=a0c6f78dee2e019426fdafc0e9723c43; PVID=1; video_page_version=v_old_home_20; i-wanna-go-back=-1; CURRENT_BLACKGAP=0; fingerprint=223528c31c69cbcf420fb2d2c3acaa31; sid=ju9z7za2; DedeUserID=300983155; DedeUserID__ckMd5=d56358847e230285; SESSDATA=bf78044f,1657612179,c00e7*11; bili_jct=2f9cddd29ef4513a872221c34e95c6bf; b_ut=5; innersign=0; bp_video_offset_300983155=615615632682074400; CURRENT_FNVAL=80",
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
(async () => {
	const res = await prompt({
		type: "number",
		name: "uid",
		message: "请输入你的uid",
	});
	console.log(res);
	getFans(res.uid);
})();

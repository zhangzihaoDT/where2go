import { CandidateDestination } from "../lib/types";
import { getCityGeocode } from "./cityGeocode";

const rawDestinations = [
  {"name":"AZARA游牧·阿坝遗丘","location":"四川省阿坝州"},
  {"name":"GRAND JOLI大美华宿·云半山度假酒店","location":"云南省丽江市"},
  {"name":"MEILIE翎（广州西关店）","location":"广东省广州市"},
  {"name":"MEILIE翎（西安钟楼店）","location":"陕西省西安市"},
  {"name":"PLAN B-安那度疗愈民宿","location":"湖北省咸宁市"},
  {"name":"YOOOO枕海入眠夕阳海设计师庄园","location":"福建省福州市"},
  {"name":"阿凯缦迦·安隐李氏大院","location":"云南省大理州"},
  {"name":"艾海兰 Ahalan Villa Retreat·泉州梧林","location":"福建省泉州市"},
  {"name":"安南达","location":"云南省大理市"},
  {"name":"安缇缦·缇居","location":"浙江省绍兴市"},
  {"name":"安之若宿·梓有集","location":"湖北省咸宁市"},
  {"name":"白哈巴野自在民宿","location":"新疆伊犁哈萨克自治州"},
  {"name":"白满川亲子民宿","location":"四川省绵阳市"},
  {"name":"半渡·安那达野奢酒店（香格里拉店）","location":"云南省迪庆州"},
  {"name":"不如方（临海丹楹店）","location":"浙江省台州市"},
  {"name":"不宿久之森林私汤民宿","location":"陕西省商洛市"},
  {"name":"不在山林","location":"四川省阿坝州"},
  {"name":"崇左在野宿集·既见野奢雨林Villa","location":"广西崇左市"},
  {"name":"从江云幻秘境民宿","location":"贵州省黔东南州"},
  {"name":"重构·冰瓯馆人文度假民宿","location":"江苏省扬州市"},
  {"name":"重庆·雾屿山行","location":"重庆市沙坪坝区"},
  {"name":"达那也·金华小冰岛","location":"浙江省金华市"},
  {"name":"大乐之野（松阳店）","location":"浙江省丽水市"},
  {"name":"大理9958湖景酒店","location":"云南省大理州"},
  {"name":"大理ANJOY安汐海景酒店","location":"云南省大理州"},
  {"name":"大理凤雅颂苍洱畔酒店","location":"云南省大理州"},
  {"name":"敦煌西隅度假民宿","location":"甘肃省敦煌市"},
  {"name":"福州三坊七巷三宝宾邸","location":"福建省福州市"},
  {"name":"抚仙湖朴园·一隅安澜","location":"云南省玉溪市"},
  {"name":"归阁·守望大峡谷","location":"四川省乐山市"},
  {"name":"贵州·兴义万峰林悦栖里·咫夕民宿","location":"贵州省黔西南州"},
  {"name":"过云山居·显岗水库野站","location":"广东省惠州市"},
  {"name":"海边边Seaside","location":"浙江省台州市"},
  {"name":"汉江宿集·山之茶民宿","location":"陕西省安康市"},
  {"name":"红原国盛游牧野奢营地","location":"四川省阿坝州"},
  {"name":"厚苑","location":"云南省丽江市"},
  {"name":"湖山云隐·悬崖海景酒店","location":"云南省大理州"},
  {"name":"花筑奢·洛阳香山别院私汤度假民宿","location":"河南省洛阳市"},
  {"name":"黄山鹿鸣谷温泉度假民宿","location":"安徽省黄山市"},
  {"name":"黄山泊心云舍·微澜堂","location":"安徽省黄山市"},
  {"name":"沁相·安若小镇","location":"江西省萍乡市"},
  {"name":"江南·半舍轻奢美宿","location":"江苏省苏州市"},
  {"name":"匠心一宅·岭归私汤","location":"贵州省黔东南州"},
  {"name":"介山云庭","location":"贵州省黔东南州"},
  {"name":"锦府驿·观山","location":"四川省攀枝花市"},
  {"name":"近云丽舍","location":"浙江省丽水市"},
  {"name":"景德镇弗居人文民宿","location":"江西省景德镇市"},
  {"name":"懒生活·玲珑溪谷民宿","location":"福建省南平市"},
  {"name":"乐山匠庐·瓦山秘境Villa","location":"四川省乐山市"},
  {"name":"梵波齐宿·拉加玛藏主题民宿","location":"贵州省黔西南州"},
  {"name":"临海市羽山集民宿","location":"浙江省台州市"},
  {"name":"留白LUBAN·村墅湖景度假酒店","location":"云南省大理州"},
  {"name":"庐山·借宿·山又山法式山居","location":"江西省九江市"},
  {"name":"泸沽湖玉隐园·湖畔度假庄园","location":"云南省丽江市"},
  {"name":"鹿柴山集绛南山度假社区","location":"浙江省衢州市"},
  {"name":"梦园彼岸海景度假民宿","location":"广东省深圳市"},
  {"name":"明训别院·在山野villa轻奢度假空间","location":"江西省上饶市"},
  {"name":"莫干山缦田生态度假酒店","location":"浙江省湖州市"},
  {"name":"墨野·雪山悬崖酒店","location":"云南省迪庆州"},
  {"name":"木溪民宿","location":"湖北省咸宁市"},
  {"name":"木栖·雾气雨林度假酒店","location":"云南省西双版纳州"},
  {"name":"那日·泊设计师度假民宿（长白山西站店）","location":"吉林省白山市"},
  {"name":"南昌ONLYONE湖心岛民宿","location":"江西省南昌市"},
  {"name":"南京涵舍·珍珠泉温泉麓野山居","location":"江苏省南京市"},
  {"name":"宁波东钱湖等风来酒店","location":"浙江省宁波市"},
  {"name":"怒江秘境湾酒店","location":"云南省怒江州"},
  {"name":"平措康桑热振文化遗产民宿","location":"西藏拉萨市"},
  {"name":"平潭海峡客栈·眠见岛屿海景Villa","location":"福建省福州市"},
  {"name":"璞若观山·山东五莲县","location":"山东省日照市"},
  {"name":"璞若山居·广东罗浮山","location":"广东省惠州市"},
  {"name":"七封信·展阅安邸","location":"贵州省黔东南州"},
  {"name":"千山茶渡","location":"陕西省汉中市"},
  {"name":"千寻集梦庄园","location":"山东省威海市"},
  {"name":"青城山青暇山居野奢度假酒店","location":"四川省成都市"},
  {"name":"若水山居·度假民宿","location":"四川省阿坝州"},
  {"name":"萨迦古城平措康桑文化遗产民宿","location":"西藏日喀则市"},
  {"name":"三山来迟·下浪溪谷民宿","location":"广西桂林市"},
  {"name":"三宅一界温泉森氧美酒店","location":"云南省保山市"},
  {"name":"沙溪诗边·合VILLA田园度假民宿","location":"云南省大理州"},
  {"name":"山里罗罗民宿","location":"四川省宜宾市"},
  {"name":"山野拾间·野奢天然温泉民宿","location":"云南省昆明市"},
  {"name":"山隐礼物","location":"黑龙江省哈尔滨市"},
  {"name":"山语艺术花园民宿","location":"福建省福州市"},
  {"name":"汕头香园怡庐酒店","location":"广东省汕头市"},
  {"name":"上山上·牧野","location":"四川省广安市"},
  {"name":"十一间沙屋","location":"内蒙古鄂尔多斯市"},
  {"name":"双廊·露娜litus","location":"云南省大理州"},
  {"name":"四姑娘山仰望星空·Vacilando度假庄园","location":"四川省阿坝州"},
  {"name":"松之屿·梓有集","location":"湖北省咸宁市"},
  {"name":"松之屿3·平江路","location":"江苏省苏州市"},
  {"name":"茶喜青山森林民宿","location":"四川省成都市"},
  {"name":"陶邑上弄酒店","location":"江西省景德镇市"},
  {"name":"涠洲岛奢希全海景度假酒店","location":"广西北海市"},
  {"name":"未迟·山下四时","location":"广东省惠州市"},
  {"name":"未迟·云梦泽","location":"浙江省湖州市"},
  {"name":"温蒂妮-Ondine Ocean View Resort Hotel","location":"云南省大理州"},
  {"name":"沃里屯乡野旅宿","location":"河北省承德市"},
  {"name":"垂名境·回岗自然行迹民宿","location":"山东省青岛市"},
  {"name":"雾观山·山野宿","location":"广西桂平市"},
  {"name":"西双版纳西岸庭·西林江景Villa","location":"云南省西双版纳州"},
  {"name":"西野集·松与溪","location":"新疆伊犁哈萨克自治州"},
  {"name":"汐溪里","location":"陕西省安康市"},
  {"name":"昔在·今茶SOCOOAN隐奢度假酒店","location":"江西省赣州市"},
  {"name":"霞浦天空之城民宿","location":"福建省宁德市"},
  {"name":"闲在·塔西内草原隐宿","location":"云南省迪庆州"},
  {"name":"香格里拉叁兮·娄户度假民宿","location":"云南省迪庆州"},
  {"name":"向野而生东明山（杭州良渚文化村店）","location":"浙江省杭州市"},
  {"name":"小北山自然与你度假民宿","location":"山西省晋中市"},
  {"name":"小石山居","location":"浙江省金华市"},
  {"name":"斜阳未筑·银杏谷","location":"湖北省随州市"},
  {"name":"携程度假农庄（日照岚山联营店）","location":"山东省日照市"},
  {"name":"行山世外·森林里","location":"江西省景德镇市"},
  {"name":"雪晴集·山市晴岚度假民宿","location":"辽宁省营口市"},
  {"name":"一苇杭山海度假民宿","location":"江西省九江市"},
  {"name":"漫山海·慢享桃园度假民宿","location":"广东省惠州市"},
  {"name":"隐居乡里·欢喜山","location":"浙江省杭州市"},
  {"name":"隐居乡里·谢家院子","location":"湖南省张家界市"},
  {"name":"隐居乡里·在水一方","location":"河南省南阳市"},
  {"name":"屿山牧龙民宿","location":"贵州省安顺市"},
  {"name":"方宅·原舍海岛与悦村","location":"浙江省台州市"},
  {"name":"云雾松间","location":"浙江省杭州市"},
  {"name":"云帆耕斗北海粮仓温泉度假酒店","location":"云南省保山市"},
  {"name":"云畔·鳌峰院度假酒店","location":"福建省福州市"},
  {"name":"云七毗舍海景酒店","location":"云南省大理州"},
  {"name":"云舍小院","location":"山东省临沂市"},
  {"name":"云野有枫·牧度假村溪民宿","location":"湖南省长沙市"},
  {"name":"云竹山涧溪晚容民宿","location":"广东省广州市"},
  {"name":"长白山兰普设计酒店","location":"吉林省延边州"},
  {"name":"长时星宿","location":"青海省海北州"},
  {"name":"直木山集·浏阳店","location":"湖南省长沙市"},
  {"name":"卓邸康钦","location":"四川省阿坝州"}
];

function extractProvince(location: string): string {
  for (const p of ["新疆维吾尔自治区", "广西壮族自治区", "内蒙古自治区", "宁夏回族自治区", "西藏自治区"]) {
    if (location.startsWith(p)) return p;
  }
  for (const p of ["北京", "上海", "天津", "重庆"]) {
    if (location.startsWith(p)) return p;
  }
  for (const p of ["广东", "浙江", "江苏", "福建", "云南", "四川", "贵州", "陕西", "安徽",
    "江西", "湖南", "湖北", "河南", "山东", "山西", "河北", "辽宁", "吉林", "黑龙江",
    "甘肃", "青海", "海南", "西藏", "新疆", "广西", "内蒙古", "宁夏"]) {
    if (location.startsWith(p)) return p;
  }
  return location;
}

function extractCity(location: string): string {
  const parts = location.replace(/^(新疆维吾尔自治区|广西壮族自治区|内蒙古自治区|宁夏回族自治区|西藏自治区)/, "").trim();
  const match = parts.match(/([^省]+?(?:市|州|区|县))/);
  return match ? match[1] : parts;
}

export function loadCandidates(): CandidateDestination[] {
  return rawDestinations.map((d, i) => {
    const geo = getCityGeocode(d.location);
    const province = extractProvince(d.location);
    const city = extractCity(d.location);
    return {
      id: `d${i + 1}`,
      name: d.name,
      location: d.location,
      province,
      city,
      lat: geo?.lat,
      lng: geo?.lng,
      geoLevel: geo ? "city" as const : "unknown" as const,
      geoSource: geo ? "cityGeocode" : "none",
      geoConfidence: geo ? "high" as const : "low" as const,
    } satisfies CandidateDestination;
  });
}

export function pickRandom(candidates: CandidateDestination[], count: number): CandidateDestination[] {
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const trMainLines = [
  {
    Zh_tw: "基隆市",
    En: "Keelung City",
    Ja: "基隆市",
    Ko: "지룽시",
  },
  {
    Zh_tw: "新北市",
    En: "New Taipei City",
    Ja: "新北市",
    Ko: "신베이시",
  },
  {
    Zh_tw: "臺北市",
    En: "Taipei City",
    Ja: "台北市",
    Ko: "타이베이시",
  },
  {
    Zh_tw: "桃園市",
    En: "Taoyuan City",
    Ja: "桃園市",
    Ko: "타오위안시",
  },
  {
    Zh_tw: "新竹縣",
    En: "Hsinchu County",
    Ja: "新竹県",
    Ko: "신주현",
  },
  {
    Zh_tw: "新竹市",
    En: "Hsinchu City",
    Ja: "新竹市",
    Ko: "신주시",
  },
  {
    Zh_tw: "苗栗縣",
    En: "Miaoli County",
    Ja: "苗栗県",
    Ko: "먀오리현",
  },
  {
    Zh_tw: "臺中市",
    En: "Taichung City",
    Ja: "台中市",
    Ko: "타이중시",
  },
  {
    Zh_tw: "彰化縣",
    En: "Changhua County",
    Ja: "彰化県",
    Ko: "장화현",
  },
  {
    Zh_tw: "南投縣",
    En: "Nantou County",
    Ja: "南投県",
    Ko: "난터우현",
  },
  {
    Zh_tw: "雲林縣",
    En: "Yunlin County",
    Ja: "雲林県",
    Ko: "윈린현",
  },
  {
    Zh_tw: "嘉義縣",
    En: "Chiayi County",
    Ja: "嘉義県",
    Ko: "자이현",
  },
  {
    Zh_tw: "嘉義市",
    En: "Chiayi City",
    Ja: "嘉義市",
    Ko: "자이시",
  },
  {
    Zh_tw: "臺南市",
    En: "Tainan City",
    Ja: "台南市",
    Ko: "타이난시",
  },
  {
    Zh_tw: "高雄市",
    En: "Kaohsiung City",
    Ja: "高雄市",
    Ko: "가오슝시",
  },
  {
    Zh_tw: "屏東縣",
    En: "Pingtung County",
    Ja: "屏東県",
    Ko: "핑둥현",
  },
  {
    Zh_tw: "臺東縣",
    En: "Taitung County",
    Ja: "台東県",
    Ko: "타이둥현",
  },
  {
    Zh_tw: "花蓮縣",
    En: "Hualien County",
    Ja: "花蓮県",
    Ko: "화롄현",
  },
  {
    Zh_tw: "宜蘭縣",
    En: "Yilan County",
    Ja: "宜蘭県",
    Ko: "이란현",
  },
];

export interface TrStationData {
  StationUID: string;
  StationID: string;
  StationName: {
    Zh_tw: string;
    En: string;
    Ja: string;
    Ko: string;
  };
  StationPosition: {
    PositionLat: number;
    PositionLon: number;
  };
  StationAddress: string;
  StationPhone: string;
  StationClass: string;
  StationURL: string;
}

export const trStationDataList: TrStationData[] = [
  {
    StationUID: "TRA-0900",
    StationID: "0900",
    StationName: {
      Zh_tw: "基隆",
      En: "Keelung",
      Ja: "基隆",
      Ko: "지룽",
    },
    StationPosition: {
      PositionLon: 121.73837,
      PositionLat: 25.13191,
    },
    StationAddress: "203001基隆市中山區中山一路 16 之 1 號",
    StationPhone: "02-24263743",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0900",
  },
  {
    StationUID: "TRA-0910",
    StationID: "0910",
    StationName: {
      Zh_tw: "三坑",
      En: "Sankeng",
      Ja: "三坑",
      Ko: "싼컹",
    },
    StationPosition: {
      PositionLon: 121.74202,
      PositionLat: 25.12305,
    },
    StationAddress: "200006基隆市仁愛區德厚里龍安街 206 號",
    StationPhone: "02-24230289",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0910",
  },
  {
    StationUID: "TRA-0920",
    StationID: "0920",
    StationName: {
      Zh_tw: "八堵",
      En: "Badu",
      Ja: "八堵",
      Ko: "바두",
    },
    StationPosition: {
      PositionLon: 121.72904,
      PositionLat: 25.10838,
    },
    StationAddress: "205001基隆市暖暖區八南里八堵路 142 號",
    StationPhone: "02-24560841",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0920",
  },
  {
    StationUID: "TRA-0930",
    StationID: "0930",
    StationName: {
      Zh_tw: "七堵",
      En: "Qidu",
      Ja: "七堵",
      Ko: "치두",
    },
    StationPosition: {
      PositionLon: 121.71415,
      PositionLat: 25.09294,
    },
    StationAddress: "206006基隆市七堵區長興里東新街 2 號",
    StationPhone: "02-24553426",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0930",
  },
  {
    StationUID: "TRA-0940",
    StationID: "0940",
    StationName: {
      Zh_tw: "百福",
      En: "Baifu",
      Ja: "百福",
      Ko: "바이푸",
    },
    StationPosition: {
      PositionLon: 121.69379,
      PositionLat: 25.07795,
    },
    StationAddress: "206011基隆市七堵區堵南里明德三路 1 之 1 號",
    StationPhone: "02-24528372",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0940",
  },
  {
    StationUID: "TRA-0950",
    StationID: "0950",
    StationName: {
      Zh_tw: "五堵",
      En: "Wudu",
      Ja: "五堵",
      Ko: "우두",
    },
    StationPosition: {
      PositionLon: 121.66758,
      PositionLat: 25.07799,
    },
    StationAddress: "221041新北市汐止區長安里長安路 17 號",
    StationPhone: "02-86476200",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0950",
  },
  {
    StationUID: "TRA-0960",
    StationID: "0960",
    StationName: {
      Zh_tw: "汐止",
      En: "Xizhi",
      Ja: "汐止",
      Ko: "시즈",
    },
    StationPosition: {
      PositionLon: 121.66113,
      PositionLat: 25.0679,
    },
    StationAddress: "221029新北市汐止區信望里信義路 1 號",
    StationPhone: "02-26415096",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0960",
  },
  {
    StationUID: "TRA-0970",
    StationID: "0970",
    StationName: {
      Zh_tw: "汐科",
      En: "Xike",
      Ja: "汐科",
      Ko: "시커",
    },
    StationPosition: {
      PositionLon: 121.65233,
      PositionLat: 25.06406,
    },
    StationAddress: "221026新北市汐止區大同里大同路二段 182 號",
    StationPhone: "02-26499817#8730",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0970",
  },
  {
    StationUID: "TRA-0980",
    StationID: "0980",
    StationName: {
      Zh_tw: "南港",
      En: "Nangang",
      Ja: "南港",
      Ko: "난강",
    },
    StationPosition: {
      PositionLon: 121.60706,
      PositionLat: 25.05348,
    },
    StationAddress: "115018臺北市南港區南港里南港路一段 313 號 B2",
    StationPhone: "02-27838645",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0980",
  },
  {
    StationUID: "TRA-0990",
    StationID: "0990",
    StationName: {
      Zh_tw: "松山",
      En: "Songshan",
      Ja: "松山",
      Ko: "쑹산",
    },
    StationPosition: {
      PositionLon: 121.57906,
      PositionLat: 25.04927,
    },
    StationAddress: "110417臺北市信義區松山路 11 號B1",
    StationPhone: "02-27673819",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/0990",
  },
  {
    StationUID: "TRA-1000",
    StationID: "1000",
    StationName: {
      Zh_tw: "臺北",
      En: "Taipei",
      Ja: "台北",
      Ko: "타이베이",
    },
    StationPosition: {
      PositionLon: 121.51711,
      PositionLat: 25.04775,
    },
    StationAddress: "100230臺北市中正區黎明里北平西路 3 號",
    StationPhone: "02-23713558",
    StationClass: "0",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1000",
  },
  {
    StationUID: "TRA-1001",
    StationID: "1001",
    StationName: {
      Zh_tw: "臺北-環島",
      En: "Taipei Surround Island",
      Ja: "台北-環島",
      Ko: "타이베이-환다오",
    },
    StationPosition: {
      PositionLon: 121.51711,
      PositionLat: 25.04774,
    },
    StationAddress: "100230臺北市中正區",
    StationPhone: "",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1001",
  },
  {
    StationUID: "TRA-1010",
    StationID: "1010",
    StationName: {
      Zh_tw: "萬華",
      En: "Wanhua",
      Ja: "萬華",
      Ko: "완화",
    },
    StationPosition: {
      PositionLon: 121.49996,
      PositionLat: 25.03339,
    },
    StationAddress: "108220臺北市萬華區富福里康定路 382 號",
    StationPhone: "02-23020481",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1010",
  },
  {
    StationUID: "TRA-1020",
    StationID: "1020",
    StationName: {
      Zh_tw: "板橋",
      En: "Banqiao",
      Ja: "板橋",
      Ko: "반차오",
    },
    StationPosition: {
      PositionLon: 121.46377,
      PositionLat: 25.01434,
    },
    StationAddress: "220227新北市板橋區新民里縣民大道二段 7 號（縣民大道側）",
    StationPhone: "02-89691036",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1020",
  },
  {
    StationUID: "TRA-1030",
    StationID: "1030",
    StationName: {
      Zh_tw: "浮洲",
      En: "Fuzhou",
      Ja: "浮洲",
      Ko: "푸저우",
    },
    StationPosition: {
      PositionLon: 121.44477,
      PositionLat: 25.00419,
    },
    StationAddress: "22058新北市板橋區僑中里僑中二街 156 號",
    StationPhone: "02-23815226#4665",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1030",
  },
  {
    StationUID: "TRA-1040",
    StationID: "1040",
    StationName: {
      Zh_tw: "樹林",
      En: "Shulin",
      Ja: "樹林",
      Ko: "수린",
    },
    StationPosition: {
      PositionLon: 121.42442,
      PositionLat: 24.99123,
    },
    StationAddress: "238005新北市樹林區樹北里鎮前街 112 號",
    StationPhone: "02-26812052",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1040",
  },
  {
    StationUID: "TRA-1050",
    StationID: "1050",
    StationName: {
      Zh_tw: "南樹林",
      En: "South Shulin",
      Ja: "南樹林",
      Ko: "난수린",
    },
    StationPosition: {
      PositionLon: 121.40884,
      PositionLat: 24.98044,
    },
    StationAddress: "23846新北市樹林區東山里中山路二段 230 號",
    StationPhone: "02-26812052",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1050",
  },
  {
    StationUID: "TRA-1060",
    StationID: "1060",
    StationName: {
      Zh_tw: "山佳",
      En: "Shanjia",
      Ja: "山佳",
      Ko: "산자",
    },
    StationPosition: {
      PositionLon: 121.39254,
      PositionLat: 24.97273,
    },
    StationAddress: "238012新北市樹林區中山路三段108號",
    StationPhone: "02-26808874",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1060",
  },
  {
    StationUID: "TRA-1070",
    StationID: "1070",
    StationName: {
      Zh_tw: "鶯歌",
      En: "Yingge",
      Ja: "鶯歌",
      Ko: "잉거",
    },
    StationPosition: {
      PositionLon: 121.35517,
      PositionLat: 24.95455,
    },
    StationAddress: "239005新北市鶯歌區東鶯里文化路 68-1號",
    StationPhone: "02-26792004",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1070",
  },
  {
    StationUID: "TRA-1075",
    StationID: "1075",
    StationName: {
      Zh_tw: "鳳鳴",
      En: "Fengming",
      Ja: "鳳鳴",
      Ko: "펑밍",
    },
    StationPosition: {
      PositionLon: 121.33658,
      PositionLat: 24.97268,
    },
    StationAddress: "239013新北市鶯歌區鳳鳴里鳳一路 2 號",
    StationPhone: "",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1075",
  },
  {
    StationUID: "TRA-1080",
    StationID: "1080",
    StationName: {
      Zh_tw: "桃園",
      En: "Taoyuan",
      Ja: "桃園",
      Ko: "타오위안",
    },
    StationPosition: {
      PositionLon: 121.31449,
      PositionLat: 24.98888,
    },
    StationAddress: "330002桃園市桃園區武陵里中正路 1 號",
    StationPhone: "03-3767050",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1080",
  },
  {
    StationUID: "TRA-1090",
    StationID: "1090",
    StationName: {
      Zh_tw: "內壢",
      En: "Neili",
      Ja: "内壢",
      Ko: "네이리",
    },
    StationPosition: {
      PositionLon: 121.25826,
      PositionLat: 24.97281,
    },
    StationAddress: "320070桃園市中壢區中原里中華路一段 267 號",
    StationPhone: "03-4559725",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1090",
  },
  {
    StationUID: "TRA-1100",
    StationID: "1100",
    StationName: {
      Zh_tw: "中壢",
      En: "Zhongli_Taoyuan",
      Ja: "中壢",
      Ko: "중리(타오위안)",
    },
    StationPosition: {
      PositionLon: 121.22589,
      PositionLat: 24.95374,
    },
    StationAddress: "320001桃園市中壢區石頭里中和路 139 號",
    StationPhone: "03-4223235",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1100",
  },
  {
    StationUID: "TRA-1105",
    StationID: "1105",
    StationName: {
      Zh_tw: "平鎮",
      En: "Pingzhen",
      Ja: "平鎮",
      Ko: "핑전",
    },
    StationPosition: {
      PositionLon: 121.21481,
      PositionLat: 24.94301,
    },
    StationAddress: "324003桃園市平鎮區新富一街 66 號",
    StationPhone: "",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1105",
  },
  {
    StationUID: "TRA-1110",
    StationID: "1110",
    StationName: {
      Zh_tw: "埔心",
      En: "Puxin",
      Ja: "埔心",
      Ko: "푸신",
    },
    StationPosition: {
      PositionLon: 121.18363,
      PositionLat: 24.91939,
    },
    StationAddress: "326009桃園市楊梅區埔心里永美路 208 號",
    StationPhone: "03-4827100",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1110",
  },
  {
    StationUID: "TRA-1120",
    StationID: "1120",
    StationName: {
      Zh_tw: "楊梅",
      En: "Yangmei",
      Ja: "楊梅",
      Ko: "양메이",
    },
    StationPosition: {
      PositionLon: 121.14637,
      PositionLat: 24.91427,
    },
    StationAddress: "326101桃園市楊梅區楊梅里大成路 256 號",
    StationPhone: "03-4782893",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1120",
  },
  {
    StationUID: "TRA-1130",
    StationID: "1130",
    StationName: {
      Zh_tw: "富岡",
      En: "Fugang",
      Ja: "富岡",
      Ko: "푸강",
    },
    StationPosition: {
      PositionLon: 121.08309,
      PositionLat: 24.93436,
    },
    StationAddress: "326019桃園市楊梅區富岡里成功路 37 號",
    StationPhone: "03-4723754",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1130",
  },
  {
    StationUID: "TRA-1140",
    StationID: "1140",
    StationName: {
      Zh_tw: "新富",
      En: "Xinfu",
      Ja: "新富",
      Ko: "신푸",
    },
    StationPosition: {
      PositionLon: 121.06751,
      PositionLat: 24.93109,
    },
    StationAddress: "326019桃園市楊梅區富豐里新明街",
    StationPhone: "03-4723754",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1140",
  },
  {
    StationUID: "TRA-1150",
    StationID: "1150",
    StationName: {
      Zh_tw: "北湖",
      En: "Beihu",
      Ja: "北湖",
      Ko: "베이후",
    },
    StationPosition: {
      PositionLon: 121.05575,
      PositionLat: 24.92218,
    },
    StationAddress: "303118新竹縣湖口鄉東興村北湖路 1 號",
    StationPhone: "03-5993850",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1150",
  },
  {
    StationUID: "TRA-1160",
    StationID: "1160",
    StationName: {
      Zh_tw: "湖口",
      En: "Hukou",
      Ja: "湖口",
      Ko: "후커우",
    },
    StationPosition: {
      PositionLon: 121.04412,
      PositionLat: 24.90303,
    },
    StationAddress: "303032新竹縣湖口鄉仁勢村中山路二段 121 號",
    StationPhone: "03-5992192",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1160",
  },
  {
    StationUID: "TRA-1170",
    StationID: "1170",
    StationName: {
      Zh_tw: "新豐",
      En: "Xinfeng",
      Ja: "新豊",
      Ko: "신펑",
    },
    StationPosition: {
      PositionLon: 120.99626,
      PositionLat: 24.86939,
    },
    StationAddress: "304114新竹縣新豐鄉山崎村新興路 202 號",
    StationPhone: "03-5596314",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1170",
  },
  {
    StationUID: "TRA-1180",
    StationID: "1180",
    StationName: {
      Zh_tw: "竹北",
      En: "Zhubei",
      Ja: "竹北",
      Ko: "주베이",
    },
    StationPosition: {
      PositionLon: 121.00946,
      PositionLat: 24.83919,
    },
    StationAddress: "30265新竹縣竹北市竹義里和平街 59 號",
    StationPhone: "03-5552024",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1180",
  },
  {
    StationUID: "TRA-1190",
    StationID: "1190",
    StationName: {
      Zh_tw: "北新竹",
      En: "North Hsinchu",
      Ja: "北新竹",
      Ko: "베이신주",
    },
    StationPosition: {
      PositionLon: 120.98381,
      PositionLat: 24.80875,
    },
    StationAddress: "300002新竹市 東區東園里中華路一段 291 之 2 號",
    StationPhone: "03-5237441",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1190",
  },
  {
    StationUID: "TRA-1191",
    StationID: "1191",
    StationName: {
      Zh_tw: "千甲",
      En: "Qianjia",
      Ja: "千甲",
      Ko: "첸자",
    },
    StationPosition: {
      PositionLon: 121.0034,
      PositionLat: 24.80657,
    },
    StationAddress: "300053新竹市 東區水源里千甲路 142 號",
    StationPhone: "03-5237441",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1191",
  },
  {
    StationUID: "TRA-1192",
    StationID: "1192",
    StationName: {
      Zh_tw: "新莊",
      En: "Xinzhuang",
      Ja: "新荘",
      Ko: "신좡",
    },
    StationPosition: {
      PositionLon: 121.02196,
      PositionLat: 24.78811,
    },
    StationAddress: "300051新竹市 東區新莊里關東路 310 號",
    StationPhone: "03-5237441",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1192",
  },
  {
    StationUID: "TRA-1193",
    StationID: "1193",
    StationName: {
      Zh_tw: "竹中",
      En: "Zhuzhong",
      Ja: "竹中",
      Ko: "주중",
    },
    StationPosition: {
      PositionLon: 121.03141,
      PositionLat: 24.78145,
    },
    StationAddress: "310019新竹縣竹東鎮頭重里竹中路 145 號",
    StationPhone: "03-5962042",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1193",
  },
  {
    StationUID: "TRA-1194",
    StationID: "1194",
    StationName: {
      Zh_tw: "六家",
      En: "Liujia",
      Ja: "六家",
      Ko: "류자",
    },
    StationPosition: {
      PositionLon: 121.03941,
      PositionLat: 24.80766,
    },
    StationAddress: "302052新竹縣竹北市隘口里復興三路二段 229 號",
    StationPhone: "03-5962042",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1194",
  },
  {
    StationUID: "TRA-1201",
    StationID: "1201",
    StationName: {
      Zh_tw: "上員",
      En: "Shangyuan",
      Ja: "上員",
      Ko: "상위안",
    },
    StationPosition: {
      PositionLon: 121.05582,
      PositionLat: 24.77776,
    },
    StationAddress: "310021新竹縣竹東鎮上員里光明路 (無站房)",
    StationPhone: "03-5962042",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1201",
  },
  {
    StationUID: "TRA-1202",
    StationID: "1202",
    StationName: {
      Zh_tw: "榮華",
      En: "Ronghua",
      Ja: "栄華",
      Ko: "룽화",
    },
    StationPosition: {
      PositionLon: 121.08319,
      PositionLat: 24.74839,
    },
    StationAddress: "310008新竹縣竹東鎮仁愛里北興路 (無站房)",
    StationPhone: "03-5962042",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1202",
  },
  {
    StationUID: "TRA-1203",
    StationID: "1203",
    StationName: {
      Zh_tw: "竹東",
      En: "Zhudong",
      Ja: "竹東",
      Ko: "주둥",
    },
    StationPosition: {
      PositionLon: 121.09472,
      PositionLat: 24.73823,
    },
    StationAddress: "310007新竹縣竹東鎮雞林里東林路 196 號",
    StationPhone: "03-5962042",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1203",
  },
  {
    StationUID: "TRA-1204",
    StationID: "1204",
    StationName: {
      Zh_tw: "橫山",
      En: "Hengshan",
      Ja: "横山",
      Ko: "헝산",
    },
    StationPosition: {
      PositionLon: 121.11772,
      PositionLat: 24.72041,
    },
    StationAddress: "312001新竹縣橫山鄉橫山村橫山路 97 號 (無站房)",
    StationPhone: "03-5962042",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1204",
  },
  {
    StationUID: "TRA-1205",
    StationID: "1205",
    StationName: {
      Zh_tw: "九讚頭",
      En: "Jiuzantou",
      Ja: "九讃頭",
      Ko: "주짠터우",
    },
    StationPosition: {
      PositionLon: 121.13622,
      PositionLat: 24.72062,
    },
    StationAddress: "312002新竹縣橫山鄉大肚村中豐路二段 286 巷 29 號",
    StationPhone: "03-5962042",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1205",
  },
  {
    StationUID: "TRA-1206",
    StationID: "1206",
    StationName: {
      Zh_tw: "合興",
      En: "Hexing",
      Ja: "合興",
      Ko: "허싱",
    },
    StationPosition: {
      PositionLon: 121.15437,
      PositionLat: 24.71667,
    },
    StationAddress: "312003新竹縣橫山鄉力行村中山街一段 17 號",
    StationPhone: "03-5962042",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1206",
  },
  {
    StationUID: "TRA-1207",
    StationID: "1207",
    StationName: {
      Zh_tw: "富貴",
      En: "Fugui",
      Ja: "富貴",
      Ko: "푸구이",
    },
    StationPosition: {
      PositionLon: 121.16743,
      PositionLat: 24.71551,
    },
    StationAddress: "312003新竹縣橫山鄉豐田村中山街一段 (無站房)",
    StationPhone: "03-5962042",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1207",
  },
  {
    StationUID: "TRA-1208",
    StationID: "1208",
    StationName: {
      Zh_tw: "內灣",
      En: "Neiwan",
      Ja: "内湾",
      Ko: "네이완",
    },
    StationPosition: {
      PositionLon: 121.18255,
      PositionLat: 24.70535,
    },
    StationAddress: "312003新竹縣橫山鄉內灣村中正路 6 號",
    StationPhone: "03-5962042",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1208",
  },
  {
    StationUID: "TRA-1210",
    StationID: "1210",
    StationName: {
      Zh_tw: "新竹",
      En: "Hsinchu",
      Ja: "新竹",
      Ko: "신주",
    },
    StationPosition: {
      PositionLon: 120.97157,
      PositionLat: 24.80157,
    },
    StationAddress: "300003新竹市 東區榮光里中華路二段 445 號",
    StationPhone: "03-5237441",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1210",
  },
  {
    StationUID: "TRA-1220",
    StationID: "1220",
    StationName: {
      Zh_tw: "三姓橋",
      En: "Sanxingqiao",
      Ja: "三姓橋",
      Ko: "싼싱차오",
    },
    StationPosition: {
      PositionLon: 120.92844,
      PositionLat: 24.78731,
    },
    StationAddress: "300109新竹市 香山區香山里元培街 32 巷 30 號",
    StationPhone: "03-5237441",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1220",
  },
  {
    StationUID: "TRA-1230",
    StationID: "1230",
    StationName: {
      Zh_tw: "香山",
      En: "Xiangshan",
      Ja: "香山",
      Ko: "샹산",
    },
    StationPosition: {
      PositionLon: 120.91388,
      PositionLat: 24.76311,
    },
    StationAddress: "300111新竹市 香山區朝山里中華路五段 347 巷 2 弄 27 號",
    StationPhone: "03-5237441",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1230",
  },
  {
    StationUID: "TRA-1240",
    StationID: "1240",
    StationName: {
      Zh_tw: "崎頂",
      En: "Qiding",
      Ja: "崎頂",
      Ko: "치딩",
    },
    StationPosition: {
      PositionLon: 120.87183,
      PositionLat: 24.72291,
    },
    StationAddress: "35054苗栗縣竹南鎮崎頂里北戶 55 號",
    StationPhone: "037-472030",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1240",
  },
  {
    StationUID: "TRA-1250",
    StationID: "1250",
    StationName: {
      Zh_tw: "竹南",
      En: "Zhunan",
      Ja: "竹南",
      Ko: "주난",
    },
    StationPosition: {
      PositionLon: 120.88041,
      PositionLat: 24.68654,
    },
    StationAddress: "350007苗栗縣竹南鎮竹南里中山路 166 號",
    StationPhone: "037-472030",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/1250",
  },
  {
    StationUID: "TRA-2110",
    StationID: "2110",
    StationName: {
      Zh_tw: "談文",
      En: "Tanwen",
      Ja: "談文",
      Ko: "탄원",
    },
    StationPosition: {
      PositionLon: 120.85825,
      PositionLat: 24.65641,
    },
    StationAddress: "36143苗栗縣造橋鄉談文村仁愛路 29 號",
    StationPhone: "037-472030",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2110",
  },
  {
    StationUID: "TRA-2120",
    StationID: "2120",
    StationName: {
      Zh_tw: "大山",
      En: "Dashan",
      Ja: "大山",
      Ko: "다산",
    },
    StationPosition: {
      PositionLon: 120.80376,
      PositionLat: 24.64565,
    },
    StationAddress: "35658苗栗縣後龍鎮大山里明山路 180 號",
    StationPhone: "037-431208",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2120",
  },
  {
    StationUID: "TRA-2130",
    StationID: "2130",
    StationName: {
      Zh_tw: "後龍",
      En: "Houlong",
      Ja: "後龍",
      Ko: "허우룽",
    },
    StationPosition: {
      PositionLon: 120.78731,
      PositionLat: 24.61621,
    },
    StationAddress: "35641苗栗縣後龍鎮北龍里車站街 127-2 號",
    StationPhone: "037-728616",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2130",
  },
  {
    StationUID: "TRA-2140",
    StationID: "2140",
    StationName: {
      Zh_tw: "龍港",
      En: "Longgang",
      Ja: "龍港",
      Ko: "룽강",
    },
    StationPosition: {
      PositionLon: 120.75812,
      PositionLat: 24.61169,
    },
    StationAddress: "35668苗栗縣後龍鎮龍津里7鄰公司寮 85 號",
    StationPhone: "037-728616",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2140",
  },
  {
    StationUID: "TRA-2150",
    StationID: "2150",
    StationName: {
      Zh_tw: "白沙屯",
      En: "Baishatun",
      Ja: "白沙屯",
      Ko: "바이사툰",
    },
    StationPosition: {
      PositionLon: 120.70824,
      PositionLat: 24.56481,
    },
    StationAddress: "35742苗栗縣通霄鎮白西里白西 131 號",
    StationPhone: "037-793066",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2150",
  },
  {
    StationUID: "TRA-2160",
    StationID: "2160",
    StationName: {
      Zh_tw: "新埔",
      En: "Xinpu",
      Ja: "新埔",
      Ko: "신푸",
    },
    StationPosition: {
      PositionLon: 120.69518,
      PositionLat: 24.54018,
    },
    StationAddress: "35742苗栗縣通霄鎮新埔里新埔 57 號",
    StationPhone: "037-793930",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2160",
  },
  {
    StationUID: "TRA-2170",
    StationID: "2170",
    StationName: {
      Zh_tw: "通霄",
      En: "Tongxiao",
      Ja: "通霄",
      Ko: "퉁샤오",
    },
    StationPosition: {
      PositionLon: 120.67843,
      PositionLat: 24.49141,
    },
    StationAddress: "357006苗栗縣通霄鎮通西里中正路 109 號",
    StationPhone: "037-758300",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2170",
  },
  {
    StationUID: "TRA-2180",
    StationID: "2180",
    StationName: {
      Zh_tw: "苑裡",
      En: "Yuanli",
      Ja: "苑裡",
      Ko: "위안리",
    },
    StationPosition: {
      PositionLon: 120.65146,
      PositionLat: 24.44344,
    },
    StationAddress: "358011苗栗縣苑裡鎮苑北里中山路 165 號",
    StationPhone: "037-851013",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2180",
  },
  {
    StationUID: "TRA-2190",
    StationID: "2190",
    StationName: {
      Zh_tw: "日南",
      En: "Rinan",
      Ja: "日南",
      Ko: "르난",
    },
    StationPosition: {
      PositionLon: 120.65412,
      PositionLat: 24.37815,
    },
    StationAddress: "437105臺中市大甲區孟春里中山路二段 140 巷 8 號",
    StationPhone: "04-26816113",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2190",
  },
  {
    StationUID: "TRA-2200",
    StationID: "2200",
    StationName: {
      Zh_tw: "大甲",
      En: "Dajia",
      Ja: "大甲",
      Ko: "다자",
    },
    StationPosition: {
      PositionLon: 120.62702,
      PositionLat: 24.34448,
    },
    StationAddress: "437003臺中市大甲區大甲里中山路一段 828 號",
    StationPhone: "04-26872022",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2200",
  },
  {
    StationUID: "TRA-2210",
    StationID: "2210",
    StationName: {
      Zh_tw: "臺中港",
      En: "Taichung Port",
      Ja: "台中港",
      Ko: "타이중강",
    },
    StationPosition: {
      PositionLon: 120.60231,
      PositionLat: 24.30441,
    },
    StationAddress: "43642臺中市清水區頂湳里甲南路 2 號",
    StationPhone: "04-26225374",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2210",
  },
  {
    StationUID: "TRA-2220",
    StationID: "2220",
    StationName: {
      Zh_tw: "清水",
      En: "Qingshui",
      Ja: "清水",
      Ko: "칭수이",
    },
    StationPosition: {
      PositionLon: 120.56918,
      PositionLat: 24.26364,
    },
    StationAddress: "436109臺中市清水區南社里中正街 115 號",
    StationPhone: "04-26222021",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2220",
  },
  {
    StationUID: "TRA-2230",
    StationID: "2230",
    StationName: {
      Zh_tw: "沙鹿",
      En: "Shalu",
      Ja: "沙鹿",
      Ko: "사루",
    },
    StationPosition: {
      PositionLon: 120.55752,
      PositionLat: 24.23702,
    },
    StationAddress: "43353臺中市沙鹿區沙鹿里中正街 94 號",
    StationPhone: "04-26625057",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2230",
  },
  {
    StationUID: "TRA-2240",
    StationID: "2240",
    StationName: {
      Zh_tw: "龍井",
      En: "Longjing",
      Ja: "龍井",
      Ko: "룽징",
    },
    StationPosition: {
      PositionLon: 120.54335,
      PositionLat: 24.19748,
    },
    StationAddress: "43450臺中市龍井區龍泉里龍新路 1 號",
    StationPhone: "04-26355578",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2240",
  },
  {
    StationUID: "TRA-2250",
    StationID: "2250",
    StationName: {
      Zh_tw: "大肚",
      En: "Dadu",
      Ja: "大肚",
      Ko: "다두",
    },
    StationPosition: {
      PositionLon: 120.54249,
      PositionLat: 24.15417,
    },
    StationAddress: "43242臺中市大肚區頂街里平和街 121 號",
    StationPhone: "04-26992523",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2250",
  },
  {
    StationUID: "TRA-2260",
    StationID: "2260",
    StationName: {
      Zh_tw: "追分",
      En: "Zhuifen",
      Ja: "追分",
      Ko: "주이펀",
    },
    StationPosition: {
      PositionLon: 120.57018,
      PositionLat: 24.12051,
    },
    StationAddress: "43245臺中市大肚區王田里追分街 13 號",
    StationPhone: "04-26933106",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/2260",
  },
  {
    StationUID: "TRA-3140",
    StationID: "3140",
    StationName: {
      Zh_tw: "造橋",
      En: "Zaoqiao",
      Ja: "造橋",
      Ko: "짜오차오",
    },
    StationPosition: {
      PositionLon: 120.86721,
      PositionLat: 24.64186,
    },
    StationAddress: "36144苗栗縣造橋鄉造橋村平仁路 54 號",
    StationPhone: "037-472030",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3140",
  },
  {
    StationUID: "TRA-3150",
    StationID: "3150",
    StationName: {
      Zh_tw: "豐富",
      En: "Fengfu",
      Ja: "豊富",
      Ko: "펑푸",
    },
    StationPosition: {
      PositionLon: 120.82637,
      PositionLat: 24.60429,
    },
    StationAddress: "356002苗栗縣後龍鎮校椅里高鐵一路 66 號",
    StationPhone: "037-726700",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3150",
  },
  {
    StationUID: "TRA-3160",
    StationID: "3160",
    StationName: {
      Zh_tw: "苗栗",
      En: "Miaoli",
      Ja: "苗栗",
      Ko: "먀오리",
    },
    StationPosition: {
      PositionLon: 120.82233,
      PositionLat: 24.57001,
    },
    StationAddress: "360003苗栗縣苗栗市上苗里為公路 1 號",
    StationPhone: "037-260031",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3160",
  },
  {
    StationUID: "TRA-3170",
    StationID: "3170",
    StationName: {
      Zh_tw: "南勢",
      En: "Nanshi",
      Ja: "南勢",
      Ko: "난스",
    },
    StationPosition: {
      PositionLon: 120.79154,
      PositionLat: 24.52246,
    },
    StationAddress: "360023苗栗縣苗栗市新英里南勢 39 號",
    StationPhone: "037-260031",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3170",
  },
  {
    StationUID: "TRA-3180",
    StationID: "3180",
    StationName: {
      Zh_tw: "銅鑼",
      En: "Tongluo",
      Ja: "銅鑼",
      Ko: "퉁뤄",
    },
    StationPosition: {
      PositionLon: 120.78617,
      PositionLat: 24.48634,
    },
    StationAddress: "36641苗栗縣銅鑼鄉銅鑼村大同路13號",
    StationPhone: "037-983838",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3180",
  },
  {
    StationUID: "TRA-3190",
    StationID: "3190",
    StationName: {
      Zh_tw: "三義",
      En: "Sanyi",
      Ja: "三義",
      Ko: "싼이",
    },
    StationPosition: {
      PositionLon: 120.77393,
      PositionLat: 24.42066,
    },
    StationAddress: "367001苗栗縣三義鄉雙湖村雙湖 90 號",
    StationPhone: "037-874763",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3190",
  },
  {
    StationUID: "TRA-3210",
    StationID: "3210",
    StationName: {
      Zh_tw: "泰安",
      En: "Tai'an",
      Ja: "泰安",
      Ko: "타이안",
    },
    StationPosition: {
      PositionLon: 120.74181,
      PositionLat: 24.33146,
    },
    StationAddress: "42156臺中市后里區泰安里安眉路 37 之 12 號",
    StationPhone: "04-25586540",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3210",
  },
  {
    StationUID: "TRA-3220",
    StationID: "3220",
    StationName: {
      Zh_tw: "后里",
      En: "Houli",
      Ja: "后里",
      Ko: "허우리",
    },
    StationPosition: {
      PositionLon: 120.73288,
      PositionLat: 24.30933,
    },
    StationAddress: "42142臺中市后里區義里里甲后路一段 1 號",
    StationPhone: "04-25562038",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3220",
  },
  {
    StationUID: "TRA-3230",
    StationID: "3230",
    StationName: {
      Zh_tw: "豐原",
      En: "Fengyuan",
      Ja: "豊原",
      Ko: "펑위안",
    },
    StationPosition: {
      PositionLon: 120.72374,
      PositionLat: 24.25438,
    },
    StationAddress: "420020臺中市豐原區豐原里中正路 1-1號",
    StationPhone: "04-25207950#32",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3230",
  },
  {
    StationUID: "TRA-3240",
    StationID: "3240",
    StationName: {
      Zh_tw: "栗林",
      En: "Lilin",
      Ja: "栗林",
      Ko: "리린",
    },
    StationPosition: {
      PositionLon: 120.7106,
      PositionLat: 24.23461,
    },
    StationAddress: "427001臺中市潭子區潭豐路二段747號",
    StationPhone: "04-25391401",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3240",
  },
  {
    StationUID: "TRA-3250",
    StationID: "3250",
    StationName: {
      Zh_tw: "潭子",
      En: "Tanzi",
      Ja: "潭子",
      Ko: "탄쯔",
    },
    StationPosition: {
      PositionLon: 120.70564,
      PositionLat: 24.21214,
    },
    StationAddress: "42751臺中市潭子區中山路二段352-1號",
    StationPhone: "04-25363852",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3250",
  },
  {
    StationUID: "TRA-3260",
    StationID: "3260",
    StationName: {
      Zh_tw: "頭家厝",
      En: "Toujiacuo",
      Ja: "頭家厝",
      Ko: "터우자춰",
    },
    StationPosition: {
      PositionLon: 120.70398,
      PositionLat: 24.19572,
    },
    StationAddress: "42745臺中市潭子區頭張東路43巷8號",
    StationPhone: "04-25391426",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3260",
  },
  {
    StationUID: "TRA-3270",
    StationID: "3270",
    StationName: {
      Zh_tw: "松竹",
      En: "Songzhu",
      Ja: "松竹",
      Ko: "쑹주",
    },
    StationPosition: {
      PositionLon: 120.70193,
      PositionLat: 24.18035,
    },
    StationAddress: "406015臺中市北屯區舊社里松竹路一段1473巷100號",
    StationPhone: "04-22473033",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3270",
  },
  {
    StationUID: "TRA-3280",
    StationID: "3280",
    StationName: {
      Zh_tw: "太原",
      En: "Taiyuan",
      Ja: "太原",
      Ko: "타이위안",
    },
    StationPosition: {
      PositionLon: 120.69988,
      PositionLat: 24.16449,
    },
    StationAddress: "406008臺中市北屯區北興里東光路 665 號",
    StationPhone: "04-22313926",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3280",
  },
  {
    StationUID: "TRA-3290",
    StationID: "3290",
    StationName: {
      Zh_tw: "精武",
      En: "Jingwu",
      Ja: "精武",
      Ko: "징우",
    },
    StationPosition: {
      PositionLon: 120.69784,
      PositionLat: 24.14887,
    },
    StationAddress: "401005臺中市東區東南里東光路 161號",
    StationPhone: "04-23606501",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3290",
  },
  {
    StationUID: "TRA-3300",
    StationID: "3300",
    StationName: {
      Zh_tw: "臺中",
      En: "Taichung",
      Ja: "台中",
      Ko: "타이중",
    },
    StationPosition: {
      PositionLon: 120.68691,
      PositionLat: 24.13728,
    },
    StationAddress: "400005臺中市中區綠川里臺灣大道一段 1 號",
    StationPhone: "04-22227236",
    StationClass: "0",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3300",
  },
  {
    StationUID: "TRA-3310",
    StationID: "3310",
    StationName: {
      Zh_tw: "五權",
      En: "Wuquan",
      Ja: "五権",
      Ko: "우취안",
    },
    StationPosition: {
      PositionLon: 120.66654,
      PositionLat: 24.12877,
    },
    StationAddress: "402019臺中市南區建國南路二段201號",
    StationPhone: "04-22601636",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3310",
  },
  {
    StationUID: "TRA-3320",
    StationID: "3320",
    StationName: {
      Zh_tw: "大慶",
      En: "Daqing",
      Ja: "大慶",
      Ko: "다칭",
    },
    StationPosition: {
      PositionLon: 120.64795,
      PositionLat: 24.11911,
    },
    StationAddress: "402026臺中市南區樹德里7鄰大慶街2段130號",
    StationPhone: "04-22637940",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3320",
  },
  {
    StationUID: "TRA-3330",
    StationID: "3330",
    StationName: {
      Zh_tw: "烏日",
      En: "Wuri",
      Ja: "烏日",
      Ko: "우르",
    },
    StationPosition: {
      PositionLon: 120.62244,
      PositionLat: 24.10867,
    },
    StationAddress: "41442臺中市烏日區烏日里三民街 258 號",
    StationPhone: "04-23381071",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3330",
  },
  {
    StationUID: "TRA-3340",
    StationID: "3340",
    StationName: {
      Zh_tw: "新烏日",
      En: "Xinwuri",
      Ja: "新烏日",
      Ko: "신우르",
    },
    StationPosition: {
      PositionLon: 120.61421,
      PositionLat: 24.10937,
    },
    StationAddress: "41456臺中市烏日區三和里高鐵東一路 26 號",
    StationPhone: "04-23376883",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3340",
  },
  {
    StationUID: "TRA-3350",
    StationID: "3350",
    StationName: {
      Zh_tw: "成功",
      En: "Chenggong",
      Ja: "成功",
      Ko: "청궁",
    },
    StationPosition: {
      PositionLon: 120.59021,
      PositionLat: 24.11424,
    },
    StationAddress: "414012臺中市烏日區榮泉里中山路三段 550 號",
    StationPhone: "04-23371986",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3350",
  },
  {
    StationUID: "TRA-3360",
    StationID: "3360",
    StationName: {
      Zh_tw: "彰化",
      En: "Changhua",
      Ja: "彰化",
      Ko: "장화",
    },
    StationPosition: {
      PositionLon: 120.53854,
      PositionLat: 24.08177,
    },
    StationAddress: "500003彰化縣彰化市長樂里三民路 1 號",
    StationPhone: "04-7274218#11",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3360",
  },
  {
    StationUID: "TRA-3370",
    StationID: "3370",
    StationName: {
      Zh_tw: "花壇",
      En: "Huatan",
      Ja: "花壇",
      Ko: "화탄",
    },
    StationPosition: {
      PositionLon: 120.53742,
      PositionLat: 24.02502,
    },
    StationAddress: "503009彰化縣花壇鄉花壇村中正路 370 號",
    StationPhone: "04-7881418",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3370",
  },
  {
    StationUID: "TRA-3380",
    StationID: "3380",
    StationName: {
      Zh_tw: "大村",
      En: "Dacun",
      Ja: "大村",
      Ko: "다춘",
    },
    StationPosition: {
      PositionLon: 120.56062,
      PositionLat: 23.99002,
    },
    StationAddress: "515002彰化縣大村鄉過溝村福進路 100 號",
    StationPhone: "04-8525148",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3380",
  },
  {
    StationUID: "TRA-3390",
    StationID: "3390",
    StationName: {
      Zh_tw: "員林",
      En: "Yuanlin",
      Ja: "員林",
      Ko: "위안린",
    },
    StationPosition: {
      PositionLon: 120.56977,
      PositionLat: 23.95947,
    },
    StationAddress: "510001彰化縣員林市和平里民權街 55 號",
    StationPhone: "04-8320544#14",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3390",
  },
  {
    StationUID: "TRA-3400",
    StationID: "3400",
    StationName: {
      Zh_tw: "永靖",
      En: "Yongjing",
      Ja: "永靖",
      Ko: "융징",
    },
    StationPosition: {
      PositionLon: 120.57173,
      PositionLat: 23.92808,
    },
    StationAddress: "512001彰化縣永靖鄉崙子村崙饒路25 號",
    StationPhone: "04-8320544#15",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3400",
  },
  {
    StationUID: "TRA-3410",
    StationID: "3410",
    StationName: {
      Zh_tw: "社頭",
      En: "Shetou",
      Ja: "社頭",
      Ko: "서터우",
    },
    StationPosition: {
      PositionLon: 120.58077,
      PositionLat: 23.89573,
    },
    StationAddress: "511009彰化縣社頭鄉廣興村社站路 10 號",
    StationPhone: "04-8711646",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3410",
  },
  {
    StationUID: "TRA-3420",
    StationID: "3420",
    StationName: {
      Zh_tw: "田中",
      En: "Tianzhong",
      Ja: "田中",
      Ko: "톈중",
    },
    StationPosition: {
      PositionLon: 120.59146,
      PositionLat: 23.85843,
    },
    StationAddress: "520022彰化縣田中鎮中路里中州路一段 1 號",
    StationPhone: "04-8742142",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3420",
  },
  {
    StationUID: "TRA-3430",
    StationID: "3430",
    StationName: {
      Zh_tw: "二水",
      En: "Ershui",
      Ja: "二水",
      Ko: "얼수이",
    },
    StationPosition: {
      PositionLon: 120.61805,
      PositionLat: 23.81321,
    },
    StationAddress: "530018彰化縣二水鄉光化村光文路 1 號",
    StationPhone: "04-8792027",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3430",
  },
  {
    StationUID: "TRA-3431",
    StationID: "3431",
    StationName: {
      Zh_tw: "源泉",
      En: "Yuanquan",
      Ja: "源泉",
      Ko: "위안취안",
    },
    StationPosition: {
      PositionLon: 120.64211,
      PositionLat: 23.79845,
    },
    StationAddress: "530017彰化縣二水鄉合興村英義路 (無站房)",
    StationPhone: "04-8792027",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3431",
  },
  {
    StationUID: "TRA-3432",
    StationID: "3432",
    StationName: {
      Zh_tw: "濁水",
      En: "Zhuoshui",
      Ja: "濁水",
      Ko: "줘수이",
    },
    StationPosition: {
      PositionLon: 120.70467,
      PositionLat: 23.83467,
    },
    StationAddress: "551001南投縣名間鄉濁水村車站路 15 號",
    StationPhone: "049-2735850",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3432",
  },
  {
    StationUID: "TRA-3433",
    StationID: "3433",
    StationName: {
      Zh_tw: "龍泉",
      En: "Longquan",
      Ja: "龍泉",
      Ko: "룽취안",
    },
    StationPosition: {
      PositionLon: 120.75014,
      PositionLat: 23.83521,
    },
    StationAddress: "552003南投縣集集鎮隘寮村龍泉巷 (無站房)",
    StationPhone: "04-8792027",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3433",
  },
  {
    StationUID: "TRA-3434",
    StationID: "3434",
    StationName: {
      Zh_tw: "集集",
      En: "Jiji",
      Ja: "集集",
      Ko: "지지",
    },
    StationPosition: {
      PositionLon: 120.78495,
      PositionLat: 23.82647,
    },
    StationAddress: "552001南投縣集集鎮吳厝里民生路 75 號",
    StationPhone: "049-2762546",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3434",
  },
  {
    StationUID: "TRA-3435",
    StationID: "3435",
    StationName: {
      Zh_tw: "水里",
      En: "Shuili",
      Ja: "水里",
      Ko: "수이리",
    },
    StationPosition: {
      PositionLon: 120.85332,
      PositionLat: 23.81845,
    },
    StationAddress: "553001南投縣水里鄉水里村民生路 440 號",
    StationPhone: "049-2770015",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3435",
  },
  {
    StationUID: "TRA-3436",
    StationID: "3436",
    StationName: {
      Zh_tw: "車埕",
      En: "Checheng",
      Ja: "車埕",
      Ko: "처청",
    },
    StationPosition: {
      PositionLon: 120.86572,
      PositionLat: 23.83263,
    },
    StationAddress: "553004南投縣水里鄉車埕村民權巷 2 號",
    StationPhone: "049-2774749",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3436",
  },
  {
    StationUID: "TRA-3450",
    StationID: "3450",
    StationName: {
      Zh_tw: "林內",
      En: "Linnei",
      Ja: "林内",
      Ko: "린네이",
    },
    StationPosition: {
      PositionLon: 120.61499,
      PositionLat: 23.75967,
    },
    StationAddress: "643001雲林縣林內鄉林中村中山路 42 號",
    StationPhone: "05-5892040",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3450",
  },
  {
    StationUID: "TRA-3460",
    StationID: "3460",
    StationName: {
      Zh_tw: "石榴",
      En: "Shiliu",
      Ja: "石榴",
      Ko: "스류",
    },
    StationPosition: {
      PositionLon: 120.57998,
      PositionLat: 23.73167,
    },
    StationAddress: "640155雲林縣斗六市榴北里文明路 31 號",
    StationPhone: "05-5332900",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3460",
  },
  {
    StationUID: "TRA-3470",
    StationID: "3470",
    StationName: {
      Zh_tw: "斗六",
      En: "Douliu",
      Ja: "斗六",
      Ko: "더우류",
    },
    StationPosition: {
      PositionLon: 120.54099,
      PositionLat: 23.71184,
    },
    StationAddress: "640010雲林縣斗六市信義里民生路 187 號",
    StationPhone: "05-5332900",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3470",
  },
  {
    StationUID: "TRA-3480",
    StationID: "3480",
    StationName: {
      Zh_tw: "斗南",
      En: "Dounan",
      Ja: "斗南",
      Ko: "더우난",
    },
    StationPosition: {
      PositionLon: 120.48089,
      PositionLat: 23.67257,
    },
    StationAddress: "630042雲林縣斗南鎮南昌里中山路 2 號",
    StationPhone: "05-5972039",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3480",
  },
  {
    StationUID: "TRA-3490",
    StationID: "3490",
    StationName: {
      Zh_tw: "石龜",
      En: "Shigui",
      Ja: "石亀",
      Ko: "스구이",
    },
    StationPosition: {
      PositionLon: 120.47106,
      PositionLat: 23.63951,
    },
    StationAddress: "630雲林縣斗南鎮石龜里",
    StationPhone: "05-5972039",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/3490",
  },
  {
    StationUID: "TRA-4050",
    StationID: "4050",
    StationName: {
      Zh_tw: "大林",
      En: "Dalin",
      Ja: "大林",
      Ko: "다린",
    },
    StationPosition: {
      PositionLon: 120.45597,
      PositionLat: 23.60089,
    },
    StationAddress: "622002嘉義縣大林鎮吉林里中山路 2 號",
    StationPhone: "05-2654804",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4050",
  },
  {
    StationUID: "TRA-4060",
    StationID: "4060",
    StationName: {
      Zh_tw: "民雄",
      En: "Minxiong",
      Ja: "民雄",
      Ko: "민슝",
    },
    StationPosition: {
      PositionLon: 120.43165,
      PositionLat: 23.55522,
    },
    StationAddress: "621002嘉義縣民雄鄉東榮村和平路 2 號",
    StationPhone: "05-2264272",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4060",
  },
  {
    StationUID: "TRA-4070",
    StationID: "4070",
    StationName: {
      Zh_tw: "嘉北",
      En: "Jiabei",
      Ja: "嘉北",
      Ko: "자베이",
    },
    StationPosition: {
      PositionLon: 120.44851,
      PositionLat: 23.49981,
    },
    StationAddress: "600050嘉義市 東區後湖里保建街 110 號",
    StationPhone: "05-2334584",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4070",
  },
  {
    StationUID: "TRA-4080",
    StationID: "4080",
    StationName: {
      Zh_tw: "嘉義",
      En: "Chiayi",
      Ja: "嘉義",
      Ko: "자이",
    },
    StationPosition: {
      PositionLon: 120.44114,
      PositionLat: 23.47915,
    },
    StationAddress: "600006嘉義市 西區番社里中山路 528 號",
    StationPhone: "05-2228904",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4080",
  },
  {
    StationUID: "TRA-4090",
    StationID: "4090",
    StationName: {
      Zh_tw: "水上",
      En: "Shuishang",
      Ja: "水上",
      Ko: "수이상",
    },
    StationPosition: {
      PositionLon: 120.39971,
      PositionLat: 23.43398,
    },
    StationAddress: "608001嘉義縣水上鄉粗溪村68號",
    StationPhone: "05-2228904",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4090",
  },
  {
    StationUID: "TRA-4100",
    StationID: "4100",
    StationName: {
      Zh_tw: "南靖",
      En: "Nanjing",
      Ja: "南靖",
      Ko: "난징",
    },
    StationPosition: {
      PositionLon: 120.38654,
      PositionLat: 23.41344,
    },
    StationAddress: "608009嘉義縣水上鄉三鎮村三鎮路 26 號",
    StationPhone: "05-2601232",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4100",
  },
  {
    StationUID: "TRA-4110",
    StationID: "4110",
    StationName: {
      Zh_tw: "後壁",
      En: "Houbi",
      Ja: "後壁",
      Ko: "허우비",
    },
    StationPosition: {
      PositionLon: 120.36058,
      PositionLat: 23.36626,
    },
    StationAddress: "731022臺南市後壁區後壁里後壁 77 號",
    StationPhone: "06-6872055",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4110",
  },
  {
    StationUID: "TRA-4120",
    StationID: "4120",
    StationName: {
      Zh_tw: "新營",
      En: "Xinying",
      Ja: "新営",
      Ko: "신잉",
    },
    StationPosition: {
      PositionLon: 120.32307,
      PositionLat: 23.30673,
    },
    StationAddress: "730005臺南市新營區中營里中山路 1 號",
    StationPhone: "06-6322104",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4120",
  },
  {
    StationUID: "TRA-4130",
    StationID: "4130",
    StationName: {
      Zh_tw: "柳營",
      En: "Liuying",
      Ja: "柳営",
      Ko: "류잉",
    },
    StationPosition: {
      PositionLon: 120.32252,
      PositionLat: 23.27762,
    },
    StationAddress: "736002臺南市柳營區東昇里建國路 1 號",
    StationPhone: "06-6226450",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4130",
  },
  {
    StationUID: "TRA-4140",
    StationID: "4140",
    StationName: {
      Zh_tw: "林鳳營",
      En: "Linfengying",
      Ja: "林鳳営",
      Ko: "린펑잉",
    },
    StationPosition: {
      PositionLon: 120.32107,
      PositionLat: 23.24259,
    },
    StationAddress: "734004臺南市六甲區中社里林鳳營 16 號",
    StationPhone: "06-6986086",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4140",
  },
  {
    StationUID: "TRA-4150",
    StationID: "4150",
    StationName: {
      Zh_tw: "隆田",
      En: "Longtian",
      Ja: "隆田",
      Ko: "룽톈",
    },
    StationPosition: {
      PositionLon: 120.31917,
      PositionLat: 23.19271,
    },
    StationAddress: "720001臺南市官田區隆田里中山路一段 1 號",
    StationPhone: "06-5791664",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4150",
  },
  {
    StationUID: "TRA-4160",
    StationID: "4160",
    StationName: {
      Zh_tw: "拔林",
      En: "Balin",
      Ja: "抜林",
      Ko: "바린",
    },
    StationPosition: {
      PositionLon: 120.32125,
      PositionLat: 23.17284,
    },
    StationAddress: "720004臺南市官田區拔林里拔子林 83 之 1 號",
    StationPhone: "06-5791664",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4160",
  },
  {
    StationUID: "TRA-4170",
    StationID: "4170",
    StationName: {
      Zh_tw: "善化",
      En: "Shanhua",
      Ja: "善化",
      Ko: "산화",
    },
    StationPosition: {
      PositionLon: 120.30653,
      PositionLat: 23.13333,
    },
    StationAddress: "741001臺南市善化區光文里中山路 1 號",
    StationPhone: "06-5837301",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4170",
  },
  {
    StationUID: "TRA-4180",
    StationID: "4180",
    StationName: {
      Zh_tw: "南科",
      En: "Nanke",
      Ja: "南科",
      Ko: "난커",
    },
    StationPosition: {
      PositionLon: 120.30202,
      PositionLat: 23.10726,
    },
    StationAddress: "744008臺南市新市區大營里大營 287-300 號",
    StationPhone: "06-5896356",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4180",
  },
  {
    StationUID: "TRA-4190",
    StationID: "4190",
    StationName: {
      Zh_tw: "新市",
      En: "Xinshi",
      Ja: "新市",
      Ko: "신스",
    },
    StationPosition: {
      PositionLon: 120.29004,
      PositionLat: 23.06823,
    },
    StationAddress: "744004臺南市新市區新和里中華路 1 號",
    StationPhone: "06-5996911",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4190",
  },
  {
    StationUID: "TRA-4200",
    StationID: "4200",
    StationName: {
      Zh_tw: "永康",
      En: "Yongkang",
      Ja: "永康",
      Ko: "융캉",
    },
    StationPosition: {
      PositionLon: 120.25347,
      PositionLat: 23.03825,
    },
    StationAddress: "710017臺南市永康區埔園里中山路 459 號",
    StationPhone: "06-2323305",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4200",
  },
  {
    StationUID: "TRA-4210",
    StationID: "4210",
    StationName: {
      Zh_tw: "大橋",
      En: "Daqiao",
      Ja: "大橋",
      Ko: "다차오",
    },
    StationPosition: {
      PositionLon: 120.22429,
      PositionLat: 23.01923,
    },
    StationAddress: "710009臺南市永康區西橋里中華路 835 號",
    StationPhone: "06-3021755",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4210",
  },
  {
    StationUID: "TRA-4220",
    StationID: "4220",
    StationName: {
      Zh_tw: "臺南",
      En: "Tainan",
      Ja: "台南",
      Ko: "타이난",
    },
    StationPosition: {
      PositionLon: 120.21295,
      PositionLat: 22.99681,
    },
    StationAddress: "701014臺南市東區成大里北門路二段4號",
    StationPhone: "06-2261314",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4220",
  },
  {
    StationUID: "TRA-4250",
    StationID: "4250",
    StationName: {
      Zh_tw: "保安",
      En: "Bao'an",
      Ja: "保安",
      Ko: "바오안",
    },
    StationPosition: {
      PositionLon: 120.23158,
      PositionLat: 22.93296,
    },
    StationAddress: "717015臺南市仁德區保安里文賢路一段 529 巷 10 號",
    StationPhone: "06-2665988",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4250",
  },
  {
    StationUID: "TRA-4260",
    StationID: "4260",
    StationName: {
      Zh_tw: "仁德",
      En: "Rende",
      Ja: "仁徳",
      Ko: "런더",
    },
    StationPosition: {
      PositionLon: 120.24054,
      PositionLat: 22.92354,
    },
    StationAddress: "717010臺南市仁德區保安里永德路 10 號",
    StationPhone: "06-2669383",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4260",
  },
  {
    StationUID: "TRA-4270",
    StationID: "4270",
    StationName: {
      Zh_tw: "中洲",
      En: "Zhongzhou",
      Ja: "中洲",
      Ko: "중저우",
    },
    StationPosition: {
      PositionLon: 120.25284,
      PositionLat: 22.90446,
    },
    StationAddress: "717014臺南市仁德區中洲五街236號",
    StationPhone: "06-2667191",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4270",
  },
  {
    StationUID: "TRA-4271",
    StationID: "4271",
    StationName: {
      Zh_tw: "長榮大學",
      En: "Chang Jung Christian University",
      Ja: "長栄大学",
      Ko: "창룽대학",
    },
    StationPosition: {
      PositionLon: 120.27263,
      PositionLat: 22.90729,
    },
    StationAddress: "711010臺南市歸仁區大潭里長大路15 號",
    StationPhone: "06-2782615",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4271",
  },
  {
    StationUID: "TRA-4272",
    StationID: "4272",
    StationName: {
      Zh_tw: "沙崙",
      En: "Shalun",
      Ja: "沙崙",
      Ko: "사룬",
    },
    StationPosition: {
      PositionLon: 120.28622,
      PositionLat: 22.92407,
    },
    StationAddress: "711010臺南市歸仁區沙崙里歸仁大道 102 號",
    StationPhone: "06-3032686",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4272",
  },
  {
    StationUID: "TRA-4290",
    StationID: "4290",
    StationName: {
      Zh_tw: "大湖",
      En: "Dahu",
      Ja: "大湖",
      Ko: "다후",
    },
    StationPosition: {
      PositionLon: 120.25384,
      PositionLat: 22.87821,
    },
    StationAddress: "821004高雄市路竹區甲南里天祐路 24 號",
    StationPhone: "07-6932127",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4290",
  },
  {
    StationUID: "TRA-4300",
    StationID: "4300",
    StationName: {
      Zh_tw: "路竹",
      En: "Luzhu",
      Ja: "路竹",
      Ko: "루주",
    },
    StationPosition: {
      PositionLon: 120.26619,
      PositionLat: 22.85404,
    },
    StationAddress: "821006高雄市路竹區竹南里中正路 288 號",
    StationPhone: "07-6072723",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4300",
  },
  {
    StationUID: "TRA-4310",
    StationID: "4310",
    StationName: {
      Zh_tw: "岡山",
      En: "Gangshan",
      Ja: "岡山",
      Ko: "강산",
    },
    StationPosition: {
      PositionLon: 120.30004,
      PositionLat: 22.79223,
    },
    StationAddress: "820102高雄市岡山區碧紅里岡燕路 111 號",
    StationPhone: "07-6212074",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4310",
  },
  {
    StationUID: "TRA-4320",
    StationID: "4320",
    StationName: {
      Zh_tw: "橋頭",
      En: "Qiaotou",
      Ja: "橋頭",
      Ko: "차오터우",
    },
    StationPosition: {
      PositionLon: 120.31011,
      PositionLat: 22.76098,
    },
    StationAddress: "825008高雄市橋頭區橋頭里站前街 14 號",
    StationPhone: "07-6115424",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4320",
  },
  {
    StationUID: "TRA-4330",
    StationID: "4330",
    StationName: {
      Zh_tw: "楠梓",
      En: "Nanzi",
      Ja: "楠梓",
      Ko: "난쯔",
    },
    StationPosition: {
      PositionLon: 120.32425,
      PositionLat: 22.72696,
    },
    StationAddress: "811022高雄市楠梓區惠楠里建楠路 229 號",
    StationPhone: "07-3510175",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4330",
  },
  {
    StationUID: "TRA-4340",
    StationID: "4340",
    StationName: {
      Zh_tw: "新左營",
      En: "Xinzuoying",
      Ja: "新左営",
      Ko: "신쭤잉",
    },
    StationPosition: {
      PositionLon: 120.30678,
      PositionLat: 22.68754,
    },
    StationAddress: "813014高雄市左營區尾北里站前北路 1 號",
    StationPhone: "07-5887825",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4340",
  },
  {
    StationUID: "TRA-4350",
    StationID: "4350",
    StationName: {
      Zh_tw: "左營",
      En: "Zuoying",
      Ja: "左営",
      Ko: "쭤잉",
    },
    StationPosition: {
      PositionLon: 120.29401,
      PositionLat: 22.67445,
    },
    StationAddress: "813014高雄市左營區翠華路1050號地下1層",
    StationPhone: "07-5887835",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4350",
  },
  {
    StationUID: "TRA-4360",
    StationID: "4360",
    StationName: {
      Zh_tw: "內惟",
      En: "Neiwei",
      Ja: "内惟",
      Ko: "네이웨이",
    },
    StationPosition: {
      PositionLon: 120.28701,
      PositionLat: 22.66589,
    },
    StationAddress: "804056高雄市鼓山區翠華路500號地下1層",
    StationPhone: "07-5886119",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4360",
  },
  {
    StationUID: "TRA-4370",
    StationID: "4370",
    StationName: {
      Zh_tw: "美術館",
      En: "Museum of Fine Arts",
      Ja: "高雄美術館",
      Ko: "가오슝미술관",
    },
    StationPosition: {
      PositionLon: 120.28148,
      PositionLat: 22.65185,
    },
    StationAddress: "804016高雄市鼓山區翠華路246號",
    StationPhone: "07-5215147",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4370",
  },
  {
    StationUID: "TRA-4380",
    StationID: "4380",
    StationName: {
      Zh_tw: "鼓山",
      En: "Gushan",
      Ja: "鼓山",
      Ko: "구산",
    },
    StationPosition: {
      PositionLon: 120.28071,
      PositionLat: 22.64181,
    },
    StationAddress: "804005高雄市鼓山區鐵路街20巷6號",
    StationPhone: "07-5217014",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4380",
  },
  {
    StationUID: "TRA-4390",
    StationID: "4390",
    StationName: {
      Zh_tw: "三塊厝",
      En: "Sankuaicuo",
      Ja: "三塊厝",
      Ko: "싼콰이춰",
    },
    StationPosition: {
      PositionLon: 120.29414,
      PositionLat: 22.63931,
    },
    StationAddress: "807008高雄市三民區德北里6鄰康平街1號",
    StationPhone: "07-2856234",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4390",
  },
  {
    StationUID: "TRA-4400",
    StationID: "4400",
    StationName: {
      Zh_tw: "高雄",
      En: "Kaohsiung",
      Ja: "高雄",
      Ko: "가오슝",
    },
    StationPosition: {
      PositionLon: 120.30292,
      PositionLat: 22.63946,
    },
    StationAddress: "807001高雄市三民區港西里建國二路 318 號",
    StationPhone: "07-2352376",
    StationClass: "0",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4400",
  },
  {
    StationUID: "TRA-4410",
    StationID: "4410",
    StationName: {
      Zh_tw: "民族",
      En: "Minzu",
      Ja: "民族",
      Ko: "민쭈",
    },
    StationPosition: {
      PositionLon: 120.31494,
      PositionLat: 22.63879,
    },
    StationAddress: "807027高雄市三民區博惠里14鄰凱旋一路260號",
    StationPhone: "07-2231492",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4410",
  },
  {
    StationUID: "TRA-4420",
    StationID: "4420",
    StationName: {
      Zh_tw: "科工館",
      En: "Science And Technology Museum",
      Ja: "国立科学技術博物館",
      Ko: "과학기술박물관",
    },
    StationPosition: {
      PositionLon: 120.32603,
      PositionLat: 22.63709,
    },
    StationAddress: "807031高雄市三民區寶盛里15鄰大順三路307號",
    StationPhone: "07-2234778",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4420",
  },
  {
    StationUID: "TRA-4430",
    StationID: "4430",
    StationName: {
      Zh_tw: "正義",
      En: "Zhengyi",
      Ja: "正義",
      Ko: "정이",
    },
    StationPosition: {
      PositionLon: 120.34245,
      PositionLat: 22.63425,
    },
    StationAddress: "802001高雄市苓雅區建軍里正義路 308 號 B1",
    StationPhone: "07-7999818",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4430",
  },
  {
    StationUID: "TRA-4440",
    StationID: "4440",
    StationName: {
      Zh_tw: "鳳山",
      En: "Fongshan",
      Ja: "鳳山",
      Ko: "펑산",
    },
    StationPosition: {
      PositionLon: 120.35745,
      PositionLat: 22.63145,
    },
    StationAddress: "830025高雄市鳳山區曹公里曹公路 137 號",
    StationPhone: "07-7460423",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4440",
  },
  {
    StationUID: "TRA-4450",
    StationID: "4450",
    StationName: {
      Zh_tw: "後庄",
      En: "Houzhuang",
      Ja: "後庄",
      Ko: "허우좡",
    },
    StationPosition: {
      PositionLon: 120.39131,
      PositionLat: 22.64016,
    },
    StationAddress: "831115高雄市大寮區後庄里民慶街 9 號",
    StationPhone: "07-7020149",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4450",
  },
  {
    StationUID: "TRA-4460",
    StationID: "4460",
    StationName: {
      Zh_tw: "九曲堂",
      En: "Jiuqutang",
      Ja: "九曲堂",
      Ko: "주취탕",
    },
    StationPosition: {
      PositionLon: 120.42089,
      PositionLat: 22.65641,
    },
    StationAddress: "840001高雄市大樹區久堂里久堂路鐵路巷 15 號",
    StationPhone: "07-6512020",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4460",
  },
  {
    StationUID: "TRA-4470",
    StationID: "4470",
    StationName: {
      Zh_tw: "六塊厝",
      En: "Liukuaicuo",
      Ja: "六塊厝",
      Ko: "류콰이춰",
    },
    StationPosition: {
      PositionLon: 120.46497,
      PositionLat: 22.66597,
    },
    StationAddress: "900008屏東縣屏東市長安里光復路 392 號",
    StationPhone: "08-7515140",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/4470",
  },
  {
    StationUID: "TRA-5000",
    StationID: "5000",
    StationName: {
      Zh_tw: "屏東",
      En: "Pingtung",
      Ja: "屏東",
      Ko: "핑둥",
    },
    StationPosition: {
      PositionLon: 120.48617,
      PositionLat: 22.66905,
    },
    StationAddress: "900011屏東縣屏東市建國里公勇路 62 號",
    StationPhone: "08-7515140",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5000",
  },
  {
    StationUID: "TRA-5010",
    StationID: "5010",
    StationName: {
      Zh_tw: "歸來",
      En: "Guilai",
      Ja: "帰来",
      Ko: "구이라이",
    },
    StationPosition: {
      PositionLon: 120.50263,
      PositionLat: 22.65246,
    },
    StationAddress: "900002屏東縣屏東市歸心里歸仁路 5 之 4 號",
    StationPhone: "08-7515140",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5010",
  },
  {
    StationUID: "TRA-5020",
    StationID: "5020",
    StationName: {
      Zh_tw: "麟洛",
      En: "Linluo",
      Ja: "麟洛",
      Ko: "린뤄",
    },
    StationPosition: {
      PositionLon: 120.51432,
      PositionLat: 22.63481,
    },
    StationAddress: "909141屏東縣麟洛鄉田道村中華路站前巷 15 號",
    StationPhone: "08-7515140",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5020",
  },
  {
    StationUID: "TRA-5030",
    StationID: "5030",
    StationName: {
      Zh_tw: "西勢",
      En: "Xishi",
      Ja: "西勢",
      Ko: "시스",
    },
    StationPosition: {
      PositionLon: 120.52649,
      PositionLat: 22.61637,
    },
    StationAddress: "911165屏東縣竹田鄉西勢村西豐路 2 號",
    StationPhone: "08-7784521",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5030",
  },
  {
    StationUID: "TRA-5040",
    StationID: "5040",
    StationName: {
      Zh_tw: "竹田",
      En: "Zhutian",
      Ja: "竹田",
      Ko: "주톈",
    },
    StationPosition: {
      PositionLon: 120.53978,
      PositionLat: 22.58658,
    },
    StationAddress: "911165屏東縣竹田鄉履豐村豐明路29 號",
    StationPhone: "08-7711002",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5040",
  },
  {
    StationUID: "TRA-5050",
    StationID: "5050",
    StationName: {
      Zh_tw: "潮州",
      En: "Chaozhou",
      Ja: "潮州",
      Ko: "차오저우",
    },
    StationPosition: {
      PositionLon: 120.53604,
      PositionLat: 22.55008,
    },
    StationAddress: "920004屏東縣潮州鎮新榮里信義路 111 號",
    StationPhone: "08-7882739",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5050",
  },
  {
    StationUID: "TRA-5060",
    StationID: "5060",
    StationName: {
      Zh_tw: "崁頂",
      En: "Kanding",
      Ja: "崁頂",
      Ko: "칸딩",
    },
    StationPosition: {
      PositionLon: 120.51481,
      PositionLat: 22.51311,
    },
    StationAddress: "924003屏東縣崁頂鄉崁頂村田寮路",
    StationPhone: "08-7882739",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5060",
  },
  {
    StationUID: "TRA-5070",
    StationID: "5070",
    StationName: {
      Zh_tw: "南州",
      En: "Nanzhou",
      Ja: "南州",
      Ko: "난저우",
    },
    StationPosition: {
      PositionLon: 120.51174,
      PositionLat: 22.49207,
    },
    StationAddress: "926003屏東縣南州鄉仁里村仁里路 86 號",
    StationPhone: "08-8642942",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5070",
  },
  {
    StationUID: "TRA-5080",
    StationID: "5080",
    StationName: {
      Zh_tw: "鎮安",
      En: "Zhen'an",
      Ja: "鎮安",
      Ko: "전안",
    },
    StationPosition: {
      PositionLon: 120.51129,
      PositionLat: 22.45794,
    },
    StationAddress: "927005屏東縣林邊鄉鎮安村永和路4號",
    StationPhone: "08-8642942",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5080",
  },
  {
    StationUID: "TRA-5090",
    StationID: "5090",
    StationName: {
      Zh_tw: "林邊",
      En: "Linbian",
      Ja: "林辺",
      Ko: "린볜",
    },
    StationPosition: {
      PositionLon: 120.51529,
      PositionLat: 22.43135,
    },
    StationAddress: "927001屏東縣林邊鄉仁和村仁愛路 33 號",
    StationPhone: "08-8751475",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5090",
  },
  {
    StationUID: "TRA-5100",
    StationID: "5100",
    StationName: {
      Zh_tw: "佳冬",
      En: "Jiadong",
      Ja: "佳冬",
      Ko: "자둥",
    },
    StationPosition: {
      PositionLon: 120.54774,
      PositionLat: 22.41409,
    },
    StationAddress: "931006屏東縣佳冬鄉六根村復興路21號",
    StationPhone: "08-8662939",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5100",
  },
  {
    StationUID: "TRA-5110",
    StationID: "5110",
    StationName: {
      Zh_tw: "東海",
      En: "Donghai",
      Ja: "東海",
      Ko: "둥하이",
    },
    StationPosition: {
      PositionLon: 120.57236,
      PositionLat: 22.39897,
    },
    StationAddress: "940002屏東縣枋寮鄉東海村西安路 92 號",
    StationPhone: "08-8782041",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5110",
  },
  {
    StationUID: "TRA-5120",
    StationID: "5120",
    StationName: {
      Zh_tw: "枋寮",
      En: "Fangliao",
      Ja: "枋寮",
      Ko: "팡랴오",
    },
    StationPosition: {
      PositionLon: 120.59511,
      PositionLat: 22.36802,
    },
    StationAddress: "940003屏東縣枋寮鄉枋寮村儲運路 18 號",
    StationPhone: "08-8782041",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5120",
  },
  {
    StationUID: "TRA-5130",
    StationID: "5130",
    StationName: {
      Zh_tw: "加祿",
      En: "Jialu",
      Ja: "加禄",
      Ko: "자루",
    },
    StationPosition: {
      PositionLon: 120.62445,
      PositionLat: 22.33085,
    },
    StationAddress: "941005屏東縣枋山鄉加祿村會社 53 號",
    StationPhone: "08-8720791",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5130",
  },
  {
    StationUID: "TRA-5140",
    StationID: "5140",
    StationName: {
      Zh_tw: "內獅",
      En: "Neishi",
      Ja: "内獅",
      Ko: "네이스",
    },
    StationPosition: {
      PositionLon: 120.64331,
      PositionLat: 22.30617,
    },
    StationAddress: "941010屏東縣枋山鄉加祿村南和 43 號",
    StationPhone: "08-8720791",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5140",
  },
  {
    StationUID: "TRA-5160",
    StationID: "5160",
    StationName: {
      Zh_tw: "枋山",
      En: "Fangshan",
      Ja: "枋山",
      Ko: "팡산",
    },
    StationPosition: {
      PositionLon: 120.65947,
      PositionLat: 22.26704,
    },
    StationAddress: "943010屏東縣獅子鄉內獅村內獅巷 84 號",
    StationPhone: "08-8720791",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5160",
  },
  {
    StationUID: "TRA-5170",
    StationID: "5170",
    StationName: {
      Zh_tw: "枋野",
      En: "Fangye",
      Ja: "枋野",
      Ko: "팡예",
    },
    StationPosition: {
      PositionLon: 120.71709,
      PositionLat: 22.28091,
    },
    StationAddress: "94350屏東縣獅子鄉內獅村內獅巷 88 號",
    StationPhone: "08-8761953",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5170",
  },
  {
    StationUID: "TRA-5190",
    StationID: "5190",
    StationName: {
      Zh_tw: "大武",
      En: "Dawu",
      Ja: "大武",
      Ko: "다우",
    },
    StationPosition: {
      PositionLon: 120.90094,
      PositionLat: 22.36526,
    },
    StationAddress: "965003臺東縣大武鄉大鳥村和平部落 33 號",
    StationPhone: "089-792056",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5190",
  },
  {
    StationUID: "TRA-5200",
    StationID: "5200",
    StationName: {
      Zh_tw: "瀧溪",
      En: "Longxi",
      Ja: "瀧渓",
      Ko: "룽시",
    },
    StationPosition: {
      PositionLon: 120.94176,
      PositionLat: 22.46102,
    },
    StationAddress: "963006臺東縣太麻里鄉多良村大溪 37 號",
    StationPhone: "089-761482",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5200",
  },
  {
    StationUID: "TRA-5210",
    StationID: "5210",
    StationName: {
      Zh_tw: "金崙",
      En: "Jinlun",
      Ja: "金崙",
      Ko: "진룬",
    },
    StationPosition: {
      PositionLon: 120.96721,
      PositionLat: 22.53161,
    },
    StationAddress: "963005臺東縣太麻里鄉金崙村金崙 47 之 17 號",
    StationPhone: "089-771068",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5210",
  },
  {
    StationUID: "TRA-5220",
    StationID: "5220",
    StationName: {
      Zh_tw: "太麻里",
      En: "Taimali",
      Ja: "太麻里",
      Ko: "타이마리",
    },
    StationPosition: {
      PositionLon: 121.00492,
      PositionLat: 22.61883,
    },
    StationAddress: "963004臺東縣太麻里鄉大王村站前路 2 號",
    StationPhone: "089-781544",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5220",
  },
  {
    StationUID: "TRA-5230",
    StationID: "5230",
    StationName: {
      Zh_tw: "知本",
      En: "Zhiben",
      Ja: "知本",
      Ko: "즈번",
    },
    StationPosition: {
      PositionLon: 121.06068,
      PositionLat: 22.71022,
    },
    StationAddress: "950103臺東縣臺東市知本里知本路二段 900 巷 85 號",
    StationPhone: "089-514482",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5230",
  },
  {
    StationUID: "TRA-5240",
    StationID: "5240",
    StationName: {
      Zh_tw: "康樂",
      En: "Kangle",
      Ja: "康楽",
      Ko: "캉러",
    },
    StationPosition: {
      PositionLon: 121.09356,
      PositionLat: 22.76426,
    },
    StationAddress: "950029臺東縣臺東市康樂里博物館路 51 巷 131 號",
    StationPhone: "089-383107",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5240",
  },
  {
    StationUID: "TRA-5998",
    StationID: "5998",
    StationName: {
      Zh_tw: "南方小站",
      En: "South",
      Ja: "みなみ駅",
      Ko: "남쪽역",
    },
    StationPosition: {
      PositionLon: 120.53658,
      PositionLat: 22.52755,
    },
    StationAddress: "92013屏東縣潮州鎮光復路 461 號",
    StationPhone: "",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5998",
  },
  {
    StationUID: "TRA-5999",
    StationID: "5999",
    StationName: {
      Zh_tw: "潮州基地",
      En: "Chaozhou Railway Workshop",
      Ja: "潮州基地",
      Ko: "차오저우기지",
    },
    StationPosition: {
      PositionLon: 120.52642,
      PositionLat: 22.52231,
    },
    StationAddress: "92054屏東縣潮州鎮光春里光復路 616 號",
    StationPhone: "08-7889880",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/5999",
  },
  {
    StationUID: "TRA-6000",
    StationID: "6000",
    StationName: {
      Zh_tw: "臺東",
      En: "Taitung",
      Ja: "台東",
      Ko: "타이둥",
    },
    StationPosition: {
      PositionLon: 121.1231,
      PositionLat: 22.79372,
    },
    StationAddress: "950030臺東縣臺東市岩灣里岩灣路 101 巷 598 號",
    StationPhone: "089-229687",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6000",
  },
  {
    StationUID: "TRA-6010",
    StationID: "6010",
    StationName: {
      Zh_tw: "山里",
      En: "Shanli",
      Ja: "山里",
      Ko: "산리",
    },
    StationPosition: {
      PositionLon: 121.13778,
      PositionLat: 22.86194,
    },
    StationAddress: "954003臺東縣卑南鄉嘉豐村山里路 108 號",
    StationPhone: "089-572370",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6010",
  },
  {
    StationUID: "TRA-6020",
    StationID: "6020",
    StationName: {
      Zh_tw: "鹿野",
      En: "Luye",
      Ja: "鹿野",
      Ko: "루예",
    },
    StationPosition: {
      PositionLon: 121.13701,
      PositionLat: 22.91249,
    },
    StationAddress: "955002臺東縣鹿野鄉鹿野村中正路 38 號",
    StationPhone: "089-550217",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6020",
  },
  {
    StationUID: "TRA-6030",
    StationID: "6030",
    StationName: {
      Zh_tw: "瑞源",
      En: "Ruiyuan",
      Ja: "瑞源",
      Ko: "루이위안",
    },
    StationPosition: {
      PositionLon: 121.15901,
      PositionLat: 22.95604,
    },
    StationAddress: "955003臺東縣鹿野鄉瑞源村瑞景路一段 336 巷 8 號 之 1",
    StationPhone: "089-580159",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6030",
  },
  {
    StationUID: "TRA-6040",
    StationID: "6040",
    StationName: {
      Zh_tw: "瑞和",
      En: "Ruihe",
      Ja: "瑞和",
      Ko: "루이허",
    },
    StationPosition: {
      PositionLon: 121.15595,
      PositionLat: 22.97997,
    },
    StationAddress: "955003臺東縣鹿野鄉瑞和村瑞景路三段 1 之 1 號",
    StationPhone: "089-580159",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6040",
  },
  {
    StationUID: "TRA-6050",
    StationID: "6050",
    StationName: {
      Zh_tw: "關山",
      En: "Guanshan",
      Ja: "関山",
      Ko: "관산",
    },
    StationPosition: {
      PositionLon: 121.16431,
      PositionLat: 23.04566,
    },
    StationAddress: "956004臺東縣關山鎮里壠里博愛路 2 號",
    StationPhone: "089-811033",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6050",
  },
  {
    StationUID: "TRA-6060",
    StationID: "6060",
    StationName: {
      Zh_tw: "海端",
      En: "Haiduan",
      Ja: "海端",
      Ko: "하이돤",
    },
    StationPosition: {
      PositionLon: 121.17676,
      PositionLat: 23.10292,
    },
    StationAddress: "956004臺東縣關山鎮德高里西莊 49 號",
    StationPhone: "089-811033",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6060",
  },
  {
    StationUID: "TRA-6070",
    StationID: "6070",
    StationName: {
      Zh_tw: "池上",
      En: "Chishang",
      Ja: "池上",
      Ko: "츠상",
    },
    StationPosition: {
      PositionLon: 121.21949,
      PositionLat: 23.12613,
    },
    StationAddress: "958003臺東縣池上鄉福文村鐵花路 30 號",
    StationPhone: "089-862097",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6070",
  },
  {
    StationUID: "TRA-6080",
    StationID: "6080",
    StationName: {
      Zh_tw: "富里",
      En: "Fuli",
      Ja: "富里",
      Ko: "푸리",
    },
    StationPosition: {
      PositionLon: 121.24864,
      PositionLat: 23.17924,
    },
    StationAddress: "983001花蓮縣富里鄉富里村車站街 56 號",
    StationPhone: "03-8831771",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6080",
  },
  {
    StationUID: "TRA-6090",
    StationID: "6090",
    StationName: {
      Zh_tw: "東竹",
      En: "Dongzhu",
      Ja: "東竹",
      Ko: "둥주",
    },
    StationPosition: {
      PositionLon: 121.27842,
      PositionLat: 23.22605,
    },
    StationAddress: "983005花蓮縣富里鄉新興村新興 23 號",
    StationPhone: "03-8821504",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6090",
  },
  {
    StationUID: "TRA-6100",
    StationID: "6100",
    StationName: {
      Zh_tw: "東里",
      En: "Dongli",
      Ja: "東里",
      Ko: "둥리",
    },
    StationPosition: {
      PositionLon: 121.30418,
      PositionLat: 23.27234,
    },
    StationAddress: "983004花蓮縣富里鄉東里村大莊路 15 之 6 號",
    StationPhone: "03-8861005",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6100",
  },
  {
    StationUID: "TRA-6110",
    StationID: "6110",
    StationName: {
      Zh_tw: "玉里",
      En: "Yuli",
      Ja: "玉里",
      Ko: "위리",
    },
    StationPosition: {
      PositionLon: 121.31172,
      PositionLat: 23.33155,
    },
    StationAddress: "981003花蓮縣玉里鎮中城里康樂街 39 號",
    StationPhone: "03-8882020",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6110",
  },
  {
    StationUID: "TRA-6120",
    StationID: "6120",
    StationName: {
      Zh_tw: "三民",
      En: "Sanmin",
      Ja: "三民",
      Ko: "싼민",
    },
    StationPosition: {
      PositionLon: 121.34539,
      PositionLat: 23.42458,
    },
    StationAddress: "981010花蓮縣玉里鎮三民里三民 10 號",
    StationPhone: "03-8841847",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6120",
  },
  {
    StationUID: "TRA-6130",
    StationID: "6130",
    StationName: {
      Zh_tw: "瑞穗",
      En: "Ruisui",
      Ja: "瑞穂",
      Ko: "루이쑤이",
    },
    StationPosition: {
      PositionLon: 121.37684,
      PositionLat: 23.49738,
    },
    StationAddress: "978001花蓮縣瑞穗鄉瑞穗村四維街 13 號",
    StationPhone: "03-8875039",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6130",
  },
  {
    StationUID: "TRA-6140",
    StationID: "6140",
    StationName: {
      Zh_tw: "富源",
      En: "Fuyuan",
      Ja: "富源",
      Ko: "푸위안",
    },
    StationPosition: {
      PositionLon: 121.38008,
      PositionLat: 23.58031,
    },
    StationAddress: "978003花蓮縣瑞穗鄉富源村富源路 2 號",
    StationPhone: "03-8811824",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6140",
  },
  {
    StationUID: "TRA-6150",
    StationID: "6150",
    StationName: {
      Zh_tw: "大富",
      En: "Dafu",
      Ja: "大富",
      Ko: "다푸",
    },
    StationPosition: {
      PositionLon: 121.38963,
      PositionLat: 23.60571,
    },
    StationAddress: "976007花蓮縣光復鄉大富村明德路 1 號",
    StationPhone: "03-8811824",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6150",
  },
  {
    StationUID: "TRA-6160",
    StationID: "6160",
    StationName: {
      Zh_tw: "光復",
      En: "Guangfu",
      Ja: "光復",
      Ko: "광푸",
    },
    StationPosition: {
      PositionLon: 121.42117,
      PositionLat: 23.66631,
    },
    StationAddress: "976007花蓮縣光復鄉大安村中正路一段 2 之 1 號",
    StationPhone: "03-8704143",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6160",
  },
  {
    StationUID: "TRA-6170",
    StationID: "6170",
    StationName: {
      Zh_tw: "萬榮",
      En: "Wanrong",
      Ja: "萬栄",
      Ko: "완룽",
    },
    StationPosition: {
      PositionLon: 121.41907,
      PositionLat: 23.71199,
    },
    StationAddress: "975003花蓮縣鳳林鎮長橋里長德街 17 號",
    StationPhone: "03-8752175",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6170",
  },
  {
    StationUID: "TRA-6180",
    StationID: "6180",
    StationName: {
      Zh_tw: "鳳林",
      En: "Fenglin",
      Ja: "鳳林",
      Ko: "펑린",
    },
    StationPosition: {
      PositionLon: 121.44701,
      PositionLat: 23.74634,
    },
    StationAddress: "975005花蓮縣鳳林鎮鳳智里中山路 43 號",
    StationPhone: "03-8762004",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6180",
  },
  {
    StationUID: "TRA-6190",
    StationID: "6190",
    StationName: {
      Zh_tw: "南平",
      En: "Nanping",
      Ja: "南平",
      Ko: "난핑",
    },
    StationPosition: {
      PositionLon: 121.45824,
      PositionLat: 23.78231,
    },
    StationAddress: "975002花蓮縣鳳林鎮南平里自強路 233 號",
    StationPhone: "03-8771597",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6190",
  },
  {
    StationUID: "TRA-6200",
    StationID: "6200",
    StationName: {
      Zh_tw: "林榮新光",
      En: "Linrong Shin Kong",
      Ja: "林栄新光",
      Ko: "린룽신광",
    },
    StationPosition: {
      PositionLon: 121.46169,
      PositionLat: 23.80176,
    },
    StationAddress: "975002花蓮縣鳳林鎮兆豐路800號",
    StationPhone: "03-8772677",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6200",
  },
  {
    StationUID: "TRA-6210",
    StationID: "6210",
    StationName: {
      Zh_tw: "豐田",
      En: "Fengtian",
      Ja: "豊田",
      Ko: "펑톈",
    },
    StationPosition: {
      PositionLon: 121.49618,
      PositionLat: 23.84842,
    },
    StationAddress: "974006花蓮縣壽豐鄉豐山村站前街 36 號",
    StationPhone: "03-8654251",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6210",
  },
  {
    StationUID: "TRA-6220",
    StationID: "6220",
    StationName: {
      Zh_tw: "壽豐",
      En: "Shoufeng",
      Ja: "寿豊",
      Ko: "서우펑",
    },
    StationPosition: {
      PositionLon: 121.51064,
      PositionLat: 23.86901,
    },
    StationAddress: "974002花蓮縣壽豐鄉壽豐村壽山路 1 號",
    StationPhone: "03-8653706",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6220",
  },
  {
    StationUID: "TRA-6230",
    StationID: "6230",
    StationName: {
      Zh_tw: "平和",
      En: "Pinghe",
      Ja: "平和",
      Ko: "핑허",
    },
    StationPosition: {
      PositionLon: 121.52045,
      PositionLat: 23.88279,
    },
    StationAddress: "974004花蓮縣壽豐鄉平和村平和路 1 號",
    StationPhone: "03-8653706",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6230",
  },
  {
    StationUID: "TRA-6240",
    StationID: "6240",
    StationName: {
      Zh_tw: "志學",
      En: "Zhixue",
      Ja: "志学",
      Ko: "즈쉐",
    },
    StationPosition: {
      PositionLon: 121.5295,
      PositionLat: 23.90769,
    },
    StationAddress: "974003花蓮縣壽豐鄉志學村中正路 1 號",
    StationPhone: "03-8662966",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6240",
  },
  {
    StationUID: "TRA-6250",
    StationID: "6250",
    StationName: {
      Zh_tw: "吉安",
      En: "Ji'an",
      Ja: "吉安",
      Ko: "지안",
    },
    StationPosition: {
      PositionLon: 121.58266,
      PositionLat: 23.96823,
    },
    StationAddress: "973039花蓮縣吉安鄉南昌村南昌路1號",
    StationPhone: "03-8539423",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/6250",
  },
  {
    StationUID: "TRA-7000",
    StationID: "7000",
    StationName: {
      Zh_tw: "花蓮",
      En: "Hualien",
      Ja: "花蓮",
      Ko: "화롄",
    },
    StationPosition: {
      PositionLon: 121.60131,
      PositionLat: 23.99265,
    },
    StationAddress: "970015花蓮縣花蓮市國聯里國聯一路 100 號",
    StationPhone: "03-8355941",
    StationClass: "0",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7000",
  },
  {
    StationUID: "TRA-7010",
    StationID: "7010",
    StationName: {
      Zh_tw: "北埔",
      En: "Beipu",
      Ja: "北埔",
      Ko: "베이푸",
    },
    StationPosition: {
      PositionLon: 121.60166,
      PositionLat: 24.03253,
    },
    StationAddress: "971066花蓮縣新城鄉北埔村自強街 113 號",
    StationPhone: "03-8263809",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7010",
  },
  {
    StationUID: "TRA-7020",
    StationID: "7020",
    StationName: {
      Zh_tw: "景美",
      En: "Jingmei",
      Ja: "景美",
      Ko: "징메이",
    },
    StationPosition: {
      PositionLon: 121.61095,
      PositionLat: 24.09041,
    },
    StationAddress: "972067花蓮縣秀林鄉景美村加灣 178 之 1 號",
    StationPhone: "03-8611237",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7020",
  },
  {
    StationUID: "TRA-7030",
    StationID: "7030",
    StationName: {
      Zh_tw: "新城",
      En: "Xincheng",
      Ja: "新城",
      Ko: "신청",
    },
    StationPosition: {
      PositionLon: 121.64086,
      PositionLat: 24.12756,
    },
    StationAddress: "971001花蓮縣新城鄉新城村新興一路 73 號",
    StationPhone: "03-8611237",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7030",
  },
  {
    StationUID: "TRA-7040",
    StationID: "7040",
    StationName: {
      Zh_tw: "崇德",
      En: "Chongde",
      Ja: "崇徳",
      Ko: "충더",
    },
    StationPosition: {
      PositionLon: 121.65536,
      PositionLat: 24.17199,
    },
    StationAddress: "972003花蓮縣秀林鄉崇德村海濱路 96 號",
    StationPhone: "03-8621365",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7040",
  },
  {
    StationUID: "TRA-7050",
    StationID: "7050",
    StationName: {
      Zh_tw: "和仁",
      En: "Heren",
      Ja: "和仁",
      Ko: "허런",
    },
    StationPosition: {
      PositionLon: 121.71182,
      PositionLat: 24.24225,
    },
    StationAddress: "972005花蓮縣秀林鄉和平村和仁 71 號",
    StationPhone: "03-8681221",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7050",
  },
  {
    StationUID: "TRA-7060",
    StationID: "7060",
    StationName: {
      Zh_tw: "和平",
      En: "Heping",
      Ja: "和平",
      Ko: "허핑",
    },
    StationPosition: {
      PositionLon: 121.75344,
      PositionLat: 24.29839,
    },
    StationAddress: "972005花蓮縣秀林鄉和平村和平 276 號",
    StationPhone: "03-8681009",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7060",
  },
  {
    StationUID: "TRA-7070",
    StationID: "7070",
    StationName: {
      Zh_tw: "漢本",
      En: "Hanben",
      Ja: "漢本",
      Ko: "한번",
    },
    StationPosition: {
      PositionLon: 121.76838,
      PositionLat: 24.33543,
    },
    StationAddress: "272019宜蘭縣南澳鄉澳花村蘇花路一段 56 號",
    StationPhone: "03-9985238",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7070",
  },
  {
    StationUID: "TRA-7080",
    StationID: "7080",
    StationName: {
      Zh_tw: "武塔",
      En: "Wuta",
      Ja: "武塔",
      Ko: "우타",
    },
    StationPosition: {
      PositionLon: 121.77601,
      PositionLat: 24.44879,
    },
    StationAddress: "272017宜蘭縣南澳鄉武塔村新溪路 18 號",
    StationPhone: "03-9981971",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7080",
  },
  {
    StationUID: "TRA-7090",
    StationID: "7090",
    StationName: {
      Zh_tw: "南澳",
      En: "Nan'ao",
      Ja: "南澳",
      Ko: "난아오",
    },
    StationPosition: {
      PositionLon: 121.80103,
      PositionLat: 24.46342,
    },
    StationAddress: "270010宜蘭縣蘇澳鎮南強里大通路 22 號",
    StationPhone: "03-9981971",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7090",
  },
  {
    StationUID: "TRA-7100",
    StationID: "7100",
    StationName: {
      Zh_tw: "東澳",
      En: "Dong'ao",
      Ja: "東澳",
      Ko: "둥아오",
    },
    StationPosition: {
      PositionLon: 121.83072,
      PositionLat: 24.51827,
    },
    StationAddress: "272006宜蘭縣南澳鄉東岳村東岳路 1 號",
    StationPhone: "03-9986053",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7100",
  },
  {
    StationUID: "TRA-7110",
    StationID: "7110",
    StationName: {
      Zh_tw: "永樂",
      En: "Yongle",
      Ja: "永楽",
      Ko: "융러",
    },
    StationPosition: {
      PositionLon: 121.84458,
      PositionLat: 24.56843,
    },
    StationAddress: "270011宜蘭縣蘇澳鎮永樂里圳頭路 60 號",
    StationPhone: "03-9961889",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7110",
  },
  {
    StationUID: "TRA-7120",
    StationID: "7120",
    StationName: {
      Zh_tw: "蘇澳",
      En: "Su'ao",
      Ja: "蘇澳",
      Ko: "쑤아오",
    },
    StationPosition: {
      PositionLon: 121.85143,
      PositionLat: 24.59516,
    },
    StationAddress: "270001宜蘭縣蘇澳鎮蘇南里太平路 1 號",
    StationPhone: "03-9962028",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7120",
  },
  {
    StationUID: "TRA-7130",
    StationID: "7130",
    StationName: {
      Zh_tw: "蘇澳新",
      En: "Su'aoxin",
      Ja: "蘇澳新",
      Ko: "쑤아오신",
    },
    StationPosition: {
      PositionLon: 121.82735,
      PositionLat: 24.60852,
    },
    StationAddress: "270013宜蘭縣蘇澳鎮聖愛里中山路二段 238 號",
    StationPhone: "03-9961004",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7130",
  },
  {
    StationUID: "TRA-7140",
    StationID: "7140",
    StationName: {
      Zh_tw: "新馬",
      En: "Xinma",
      Ja: "新馬",
      Ko: "신마",
    },
    StationPosition: {
      PositionLon: 121.82291,
      PositionLat: 24.61541,
    },
    StationAddress: "270013宜蘭縣蘇澳鎮新城里中山路二段 322 號",
    StationPhone: "03-9961004",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7140",
  },
  {
    StationUID: "TRA-7150",
    StationID: "7150",
    StationName: {
      Zh_tw: "冬山",
      En: "Dongshan",
      Ja: "冬山",
      Ko: "둥산",
    },
    StationPosition: {
      PositionLon: 121.79211,
      PositionLat: 24.63633,
    },
    StationAddress: "269027宜蘭縣冬山鄉冬山村中正路 1 -1號",
    StationPhone: "03-9594221",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7150",
  },
  {
    StationUID: "TRA-7160",
    StationID: "7160",
    StationName: {
      Zh_tw: "羅東",
      En: "Luodong",
      Ja: "羅東",
      Ko: "뤄둥",
    },
    StationPosition: {
      PositionLon: 121.77464,
      PositionLat: 24.67791,
    },
    StationAddress: "265010宜蘭縣羅東鎮大新里公正路 2 號",
    StationPhone: "03-9542117",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7160",
  },
  {
    StationUID: "TRA-7170",
    StationID: "7170",
    StationName: {
      Zh_tw: "中里",
      En: "Zhongli_Yilan",
      Ja: "中里",
      Ko: "중리(이란)",
    },
    StationPosition: {
      PositionLon: 121.77526,
      PositionLat: 24.69415,
    },
    StationAddress: "268018宜蘭縣五結鄉中里路",
    StationPhone: "03-9542117",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7170",
  },
  {
    StationUID: "TRA-7180",
    StationID: "7180",
    StationName: {
      Zh_tw: "二結",
      En: "Erjie",
      Ja: "二結",
      Ko: "얼제",
    },
    StationPosition: {
      PositionLon: 121.77409,
      PositionLat: 24.70528,
    },
    StationAddress: "268016宜蘭縣五結鄉五結中路三段658巷8號",
    StationPhone: "03-9650304",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7180",
  },
  {
    StationUID: "TRA-7190",
    StationID: "7190",
    StationName: {
      Zh_tw: "宜蘭",
      En: "Yilan",
      Ja: "宜蘭",
      Ko: "이란",
    },
    StationPosition: {
      PositionLon: 121.75803,
      PositionLat: 24.75457,
    },
    StationAddress: "260003宜蘭縣宜蘭市和睦里光復路 1 號",
    StationPhone: "03-9323801",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7190",
  },
  {
    StationUID: "TRA-7200",
    StationID: "7200",
    StationName: {
      Zh_tw: "四城",
      En: "Sicheng",
      Ja: "四城",
      Ko: "쓰청",
    },
    StationPosition: {
      PositionLon: 121.76271,
      PositionLat: 24.78681,
    },
    StationAddress: "262005宜蘭縣礁溪鄉吳沙村站前路 24 號",
    StationPhone: "03-9282449",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7200",
  },
  {
    StationUID: "TRA-7210",
    StationID: "7210",
    StationName: {
      Zh_tw: "礁溪",
      En: "Jiaoxi",
      Ja: "礁渓",
      Ko: "자오시",
    },
    StationPosition: {
      PositionLon: 121.77535,
      PositionLat: 24.82703,
    },
    StationAddress: "262001宜蘭縣礁溪鄉德陽村溫泉路 1 號",
    StationPhone: "03-9886940",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7210",
  },
  {
    StationUID: "TRA-7220",
    StationID: "7220",
    StationName: {
      Zh_tw: "頂埔",
      En: "Dingpu",
      Ja: "頂埔",
      Ko: "딩푸",
    },
    StationPosition: {
      PositionLon: 121.80913,
      PositionLat: 24.84391,
    },
    StationAddress: "261002宜蘭縣頭城鎮下埔里下埔路 4 之 8 號",
    StationPhone: "03-9771429",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7220",
  },
  {
    StationUID: "TRA-7230",
    StationID: "7230",
    StationName: {
      Zh_tw: "頭城",
      En: "Toucheng",
      Ja: "頭城",
      Ko: "터우청",
    },
    StationPosition: {
      PositionLon: 121.82258,
      PositionLat: 24.85898,
    },
    StationAddress: "261006宜蘭縣頭城鎮纘祥路 59 號",
    StationPhone: "03-9771429",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7230",
  },
  {
    StationUID: "TRA-7240",
    StationID: "7240",
    StationName: {
      Zh_tw: "外澳",
      En: "Wai'ao",
      Ja: "外澳",
      Ko: "와이아오",
    },
    StationPosition: {
      PositionLon: 121.84572,
      PositionLat: 24.88375,
    },
    StationAddress: "261004宜蘭縣頭城鎮濱海路二段 217 號",
    StationPhone: "03-9771429",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7240",
  },
  {
    StationUID: "TRA-7250",
    StationID: "7250",
    StationName: {
      Zh_tw: "龜山",
      En: "Guishan",
      Ja: "亀山",
      Ko: "구이산",
    },
    StationPosition: {
      PositionLon: 121.8689,
      PositionLat: 24.90484,
    },
    StationAddress: "261004宜蘭縣頭城鎮更新里濱海路三段 261 號",
    StationPhone: "03-9770351",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7250",
  },
  {
    StationUID: "TRA-7260",
    StationID: "7260",
    StationName: {
      Zh_tw: "大溪",
      En: "Daxi",
      Ja: "大渓",
      Ko: "다시",
    },
    StationPosition: {
      PositionLon: 121.88983,
      PositionLat: 24.93836,
    },
    StationAddress: "261005宜蘭縣頭城鎮濱海路五段 63 號",
    StationPhone: "03-9771429",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7260",
  },
  {
    StationUID: "TRA-7270",
    StationID: "7270",
    StationName: {
      Zh_tw: "大里",
      En: "Dali",
      Ja: "大里",
      Ko: "다리",
    },
    StationPosition: {
      PositionLon: 121.92253,
      PositionLat: 24.96677,
    },
    StationAddress: "261005宜蘭縣頭城鎮大里里濱海路六段 326 號",
    StationPhone: "03-9781171",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7270",
  },
  {
    StationUID: "TRA-7280",
    StationID: "7280",
    StationName: {
      Zh_tw: "石城",
      En: "Shicheng",
      Ja: "石城",
      Ko: "스청",
    },
    StationPosition: {
      PositionLon: 121.94507,
      PositionLat: 24.97832,
    },
    StationAddress: "261006宜蘭縣頭城鎮濱海路七段 230 號",
    StationPhone: "03-9771429",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7280",
  },
  {
    StationUID: "TRA-7290",
    StationID: "7290",
    StationName: {
      Zh_tw: "福隆",
      En: "Fulong",
      Ja: "福隆",
      Ko: "푸롱",
    },
    StationPosition: {
      PositionLon: 121.94471,
      PositionLat: 25.01595,
    },
    StationAddress: "228001新北市貢寮區福隆里福隆街 2 號",
    StationPhone: "02-24991800",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7290",
  },
  {
    StationUID: "TRA-7300",
    StationID: "7300",
    StationName: {
      Zh_tw: "貢寮",
      En: "Gongliao",
      Ja: "貢寮",
      Ko: "궁랴오",
    },
    StationPosition: {
      PositionLon: 121.90879,
      PositionLat: 25.02197,
    },
    StationAddress: "228003新北市貢寮區貢寮里朝陽街 33 號",
    StationPhone: "02-24941500",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7300",
  },
  {
    StationUID: "TRA-7310",
    StationID: "7310",
    StationName: {
      Zh_tw: "雙溪",
      En: "Shuangxi",
      Ja: "双渓",
      Ko: "솽시",
    },
    StationPosition: {
      PositionLon: 121.86654,
      PositionLat: 25.03851,
    },
    StationAddress: "227004新北市雙溪區新基里朝陽街 1 號",
    StationPhone: "02-24932980",
    StationClass: "2",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7310",
  },
  {
    StationUID: "TRA-7320",
    StationID: "7320",
    StationName: {
      Zh_tw: "牡丹",
      En: "Mudan",
      Ja: "牡丹",
      Ko: "무단",
    },
    StationPosition: {
      PositionLon: 121.85197,
      PositionLat: 25.05871,
    },
    StationAddress: "227001新北市雙溪區牡丹里51號",
    StationPhone: "02-24932980",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7320",
  },
  {
    StationUID: "TRA-7330",
    StationID: "7330",
    StationName: {
      Zh_tw: "三貂嶺",
      En: "Sandiaoling",
      Ja: "三貂嶺",
      Ko: "싼댜오링",
    },
    StationPosition: {
      PositionLon: 121.82257,
      PositionLat: 25.06555,
    },
    StationAddress: "224006新北市瑞芳區碩仁里魚寮路 1 號",
    StationPhone: "02-24977896",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7330",
  },
  {
    StationUID: "TRA-7331",
    StationID: "7331",
    StationName: {
      Zh_tw: "大華",
      En: "Dahua",
      Ja: "大華",
      Ko: "다화",
    },
    StationPosition: {
      PositionLon: 121.79732,
      PositionLat: 25.04998,
    },
    StationAddress: "226003新北市平溪區南山里六分 12 之 1 號",
    StationPhone: "02-24972033",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7331",
  },
  {
    StationUID: "TRA-7332",
    StationID: "7332",
    StationName: {
      Zh_tw: "十分",
      En: "Shifen",
      Ja: "十分",
      Ko: "스펀",
    },
    StationPosition: {
      PositionLon: 121.77514,
      PositionLat: 25.04111,
    },
    StationAddress: "226003新北市平溪區十分里十分街 51 號",
    StationPhone: "02-24958307",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7332",
  },
  {
    StationUID: "TRA-7333",
    StationID: "7333",
    StationName: {
      Zh_tw: "望古",
      En: "Wanggu",
      Ja: "望古",
      Ko: "왕구",
    },
    StationPosition: {
      PositionLon: 121.76349,
      PositionLat: 25.03445,
    },
    StationAddress: "226003新北市平溪區望古里 (無站房)",
    StationPhone: "02-24972033",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7333",
  },
  {
    StationUID: "TRA-7334",
    StationID: "7334",
    StationName: {
      Zh_tw: "嶺腳",
      En: "Lingjiao",
      Ja: "嶺脚",
      Ko: "링자오",
    },
    StationPosition: {
      PositionLon: 121.74795,
      PositionLat: 25.03016,
    },
    StationAddress: "226001新北市平溪區嶺腳里嶺腳寮 22 號",
    StationPhone: "02-24972033",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7334",
  },
  {
    StationUID: "TRA-7335",
    StationID: "7335",
    StationName: {
      Zh_tw: "平溪",
      En: "Pingxi",
      Ja: "平渓",
      Ko: "핑시",
    },
    StationPosition: {
      PositionLon: 121.74019,
      PositionLat: 25.02571,
    },
    StationAddress: "226001新北市平溪區平溪里中華街 12 號",
    StationPhone: "02-24972033",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7335",
  },
  {
    StationUID: "TRA-7336",
    StationID: "7336",
    StationName: {
      Zh_tw: "菁桐",
      En: "Jingtong",
      Ja: "菁桐",
      Ko: "징퉁",
    },
    StationPosition: {
      PositionLon: 121.72391,
      PositionLat: 25.02391,
    },
    StationAddress: "226002新北市平溪區菁桐里菁桐街 52 號",
    StationPhone: "02-24972033",
    StationClass: "4",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7336",
  },
  {
    StationUID: "TRA-7350",
    StationID: "7350",
    StationName: {
      Zh_tw: "猴硐",
      En: "Houtong",
      Ja: "猴硐",
      Ko: "허우통",
    },
    StationPosition: {
      PositionLon: 121.82743,
      PositionLat: 25.08702,
    },
    StationAddress: "224006新北市瑞芳區光復里柴寮路 70 號",
    StationPhone: "02-24977747",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7350",
  },
  {
    StationUID: "TRA-7360",
    StationID: "7360",
    StationName: {
      Zh_tw: "瑞芳",
      En: "Ruifang",
      Ja: "瑞芳",
      Ko: "루이팡",
    },
    StationPosition: {
      PositionLon: 121.80599,
      PositionLat: 25.10872,
    },
    StationAddress: "224001新北市瑞芳區龍潭里明燈路三段 82 號",
    StationPhone: "02-24972033",
    StationClass: "1",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7360",
  },
  {
    StationUID: "TRA-7361",
    StationID: "7361",
    StationName: {
      Zh_tw: "海科館",
      En: "Haikeguan",
      Ja: "海科館",
      Ko: "하이커관",
    },
    StationPosition: {
      PositionLon: 121.79997,
      PositionLat: 25.13754,
    },
    StationAddress: "202010基隆市中正區長潭里",
    StationPhone: "02-24972033",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7361",
  },
  {
    StationUID: "TRA-7362",
    StationID: "7362",
    StationName: {
      Zh_tw: "八斗子",
      En: "Badouzi",
      Ja: "八斗子",
      Ko: "바더우쯔",
    },
    StationPosition: {
      PositionLon: 121.80286,
      PositionLat: 25.13528,
    },
    StationAddress:
      "224007新北市瑞芳區建基路2段121號隔壁 砂子里省道臺 2 線 (與新北市瑞芳區交界處、無站房)",
    StationPhone: "02-24972033",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7362",
  },
  {
    StationUID: "TRA-7380",
    StationID: "7380",
    StationName: {
      Zh_tw: "四腳亭",
      En: "Sijiaoting",
      Ja: "四脚亭",
      Ko: "쓰자오팅",
    },
    StationPosition: {
      PositionLon: 121.76195,
      PositionLat: 25.10281,
    },
    StationAddress: "224009新北市瑞芳區吉慶里中央路 65 號",
    StationPhone: "02-24579346",
    StationClass: "3",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7380",
  },
  {
    StationUID: "TRA-7390",
    StationID: "7390",
    StationName: {
      Zh_tw: "暖暖",
      En: "Nuannuan",
      Ja: "暖暖",
      Ko: "놘놘",
    },
    StationPosition: {
      PositionLon: 121.74031,
      PositionLat: 25.10231,
    },
    StationAddress: "20544基隆市暖暖區暖暖里暖暖街 51 號",
    StationPhone: "02-24560841",
    StationClass: "5",
    StationURL:
      "https://www.trc.com.tw/tra-tip-web/tip/tip00H/tipH41/viewStaInfo/7390",
  },
];

export interface ThsrStationData {
  StationUID: string;
  StationID: string;
  StationCode: string;
  StationName: {
    Zh_tw: string;
    En: string;
    Ja: string;
    Ko: string;
  };
  StationAddress: string;
  OperatorID: string;
  UpdateTime: string;
  VersionID: number;
  StationPosition: {
    PositionLat: number;
    PositionLon: number;
    GeoHash: string;
  };
  LocationCity: string;
  LocationCityCode: string;
  LocationTown: string;
  LocationTownCode: string;
}

export const thsrStationDataList: ThsrStationData[] = [
  {
    StationUID: "THSR-0990",
    StationID: "0990",
    StationCode: "NAK",
    StationName: {
      Zh_tw: "南港",
      En: "Nangang",
      Ja: "南港",
      Ko: "난강",
    },
    StationAddress: "台北市南港區南港路一段313號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 121.60709,
      PositionLat: 25.053704,
      GeoHash: "wsqqx0zs6",
    },
    LocationCity: "臺北市",
    LocationCityCode: "TPE",
    LocationTown: "南港區",
    LocationTownCode: "63000090",
  },
  {
    StationUID: "THSR-1000",
    StationID: "1000",
    StationCode: "TPE",
    StationName: {
      Zh_tw: "台北",
      En: "Taipei",
      Ja: "台北",
      Ko: "타이베이",
    },
    StationAddress: "台北市北平西路3號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 121.516983,
      PositionLat: 25.04767,
      GeoHash: "wsqqmpvcq",
    },
    LocationCity: "臺北市",
    LocationCityCode: "TPE",
    LocationTown: "中正區",
    LocationTownCode: "63000050",
  },
  {
    StationUID: "THSR-1010",
    StationID: "1010",
    StationCode: "BAC",
    StationName: {
      Zh_tw: "板橋",
      En: "Banqiao",
      Ja: "板橋",
      Ko: "반차오",
    },
    StationAddress: "新北市板橋區縣民大道二段7號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 121.4638,
      PositionLat: 25.014214,
      GeoHash: "wsqq7cxnr",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "板橋區",
    LocationTownCode: "65000010",
  },
  {
    StationUID: "THSR-1020",
    StationID: "1020",
    StationCode: "TAY",
    StationName: {
      Zh_tw: "桃園",
      En: "Taoyuan",
      Ja: "桃園",
      Ko: "타오위안",
    },
    StationAddress: "桃園市中壢區高鐵北路一段6號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 121.214729,
      PositionLat: 25.012861,
      GeoHash: "wsqnq33y7",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
  {
    StationUID: "THSR-1030",
    StationID: "1030",
    StationCode: "HSC",
    StationName: {
      Zh_tw: "新竹",
      En: "Hsinchu",
      Ja: "新竹",
      Ko: "신주",
    },
    StationAddress: "新竹縣竹北市高鐵七路6號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 121.04026,
      PositionLat: 24.808441,
      GeoHash: "wsqj4k4zd",
    },
    LocationCity: "新竹縣",
    LocationCityCode: "HSQ",
    LocationTown: "竹北市",
    LocationTownCode: "10004010",
  },
  {
    StationUID: "THSR-1035",
    StationID: "1035",
    StationCode: "MIL",
    StationName: {
      Zh_tw: "苗栗",
      En: "Miaoli",
      Ja: "苗栗",
      Ko: "먀오리",
    },
    StationAddress: "苗栗縣後龍鎮高鐵三路268號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.825272,
      PositionLat: 24.605448,
      GeoHash: "wsmgvrq30",
    },
    LocationCity: "苗栗縣",
    LocationCityCode: "MIA",
    LocationTown: "後龍鎮",
    LocationTownCode: "10005060",
  },
  {
    StationUID: "THSR-1040",
    StationID: "1040",
    StationCode: "TAC",
    StationName: {
      Zh_tw: "台中",
      En: "Taichung",
      Ja: "台中",
      Ko: "타이중",
    },
    StationAddress: "台中市烏日區站區二路8號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.615967,
      PositionLat: 24.112484,
      GeoHash: "wsmc0ttc7",
    },
    LocationCity: "臺中市",
    LocationCityCode: "TXG",
    LocationTown: "烏日區",
    LocationTownCode: "66000230",
  },
  {
    StationUID: "THSR-1043",
    StationID: "1043",
    StationCode: "CHA",
    StationName: {
      Zh_tw: "彰化",
      En: "Changhua",
      Ja: "彰化",
      Ko: "장화",
    },
    StationAddress: "彰化縣田中鎮站區路二段99號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.574608,
      PositionLat: 23.874327,
      GeoHash: "wsjxzdpy0",
    },
    LocationCity: "彰化縣",
    LocationCityCode: "CHA",
    LocationTown: "田中鎮",
    LocationTownCode: "10007120",
  },
  {
    StationUID: "THSR-1047",
    StationID: "1047",
    StationCode: "YUL",
    StationName: {
      Zh_tw: "雲林",
      En: "Yunlin",
      Ja: "雲林",
      Ko: "윈린",
    },
    StationAddress: "雲林縣虎尾鎮站前東路301號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.416512,
      PositionLat: 23.736231,
      GeoHash: "wsjxh1h9s",
    },
    LocationCity: "雲林縣",
    LocationCityCode: "YUN",
    LocationTown: "虎尾鎮",
    LocationTownCode: "10009030",
  },
  {
    StationUID: "THSR-1050",
    StationID: "1050",
    StationCode: "CHY",
    StationName: {
      Zh_tw: "嘉義",
      En: "Chiayi",
      Ja: "嘉義",
      Ko: "자이",
    },
    StationAddress: "嘉義縣太保市高鐵西路168號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.323257,
      PositionLat: 23.459507,
      GeoHash: "wsjt6n8tx",
    },
    LocationCity: "嘉義縣",
    LocationCityCode: "CYQ",
    LocationTown: "太保市",
    LocationTownCode: "10010010",
  },
  {
    StationUID: "THSR-1060",
    StationID: "1060",
    StationCode: "TNN",
    StationName: {
      Zh_tw: "台南",
      En: "Tainan",
      Ja: "台南",
      Ko: "타이난",
    },
    StationAddress: "台南市歸仁區歸仁大道100號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.286201,
      PositionLat: 22.925077,
      GeoHash: "wsjd3jmsr",
    },
    LocationCity: "臺南市",
    LocationCityCode: "TNN",
    LocationTown: "歸仁區",
    LocationTownCode: "67000280",
  },
  {
    StationUID: "THSR-1070",
    StationID: "1070",
    StationCode: "ZUY",
    StationName: {
      Zh_tw: "左營",
      En: "Zuoying",
      Ja: "左營",
      Ko: "쭤잉",
    },
    StationAddress: "高雄市左營區高鐵路105號",
    OperatorID: "THSR",
    UpdateTime: "2023-10-17T00:00:00+08:00",
    VersionID: 2,
    StationPosition: {
      PositionLon: 120.307487,
      PositionLat: 22.687391,
      GeoHash: "wsj91dj5x",
    },
    LocationCity: "高雄市",
    LocationCityCode: "KHH",
    LocationTown: "左營區",
    LocationTownCode: "64000030",
  },
];

export interface TymcStationData {
  /** 車站唯一識別代碼 */
  StationUID: string;
  /** 車站代號 */
  StationID: string;
  /** 車站名稱 */
  StationName: {
    Zh_tw: string;
    En: string;
    Ja: string;
    Ko: string;
  };
  /** 車站地址 */
  StationAddress: string;
  /** 假日自行車進出與否 */
  BikeAllowOnHoliday: boolean;
  /** 來源端平台資料更新時間(ISO8601格式) */
  SrcUpdateTime: string;
  /** 本平台資料更新時間(ISO8601格式) */
  UpdateTime: string;
  /** 資料版本編號 */
  VersionID: number;
  /** 車站位置 */
  StationPosition: {
    /** 位置經度(WGS84) */
    PositionLon: number;
    /** 位置緯度(WGS84) */
    PositionLat: number;
    /** 地理空間編碼 */
    GeoHash: string;
  };
  /** 車站位置所屬縣市 */
  LocationCity: string;
  /** 車站位置所屬縣市代碼 */
  LocationCityCode: string;
  /** 車站位置所屬鄉鎮 */
  LocationTown: string;
  /** 車站位置所屬鄉鎮代碼 */
  LocationTownCode: string;
}

export const tymcStationDataList: TymcStationData[] = [
  {
    StationUID: "TYMC-A1",
    StationID: "A1",
    StationName: {
      Zh_tw: "台北車站",
      En: "Taipei Main Station",
      Ja: "台北駅",
      Ko: "타이베이 역",
    },
    StationAddress: "台北市中正區鄭州路8號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.51428,
      PositionLat: 25.04869,
      GeoHash: "wsqqmpgzp",
    },
    LocationCity: "臺北市",
    LocationCityCode: "TPE",
    LocationTown: "中正區",
    LocationTownCode: "63000050",
  },
  {
    StationUID: "TYMC-A2",
    StationID: "A2",
    StationName: {
      Zh_tw: "三重站",
      En: "Sanchong Station",
      Ja: "三重駅",
      Ko: "싼충 역",
    },
    StationAddress: "新北市三重區捷運路36號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.48273,
      PositionLat: 25.0548,
      GeoHash: "wsqqs3j4b",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "三重區",
    LocationTownCode: "65000020",
  },
  {
    StationUID: "TYMC-A3",
    StationID: "A3",
    StationName: {
      Zh_tw: "新北產業園區站",
      En: "New Taipei Industrial Park Station",
      Ja: "新北産業園区駅",
      Ko: "뉴 타이베이 산업 단지 역",
    },
    StationAddress: "新北市新莊區五工路37號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.45918,
      PositionLat: 25.06171,
      GeoHash: "wsqqef7gh",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "新莊區",
    LocationTownCode: "65000050",
  },
  {
    StationUID: "TYMC-A4",
    StationID: "A4",
    StationName: {
      Zh_tw: "新莊副都心站",
      En: "Xinzhuang Fuduxin Station",
      Ja: "新荘副都心駅",
      Ko: "신좡 부도심 역",
    },
    StationAddress: "新北市新莊區新北大道四段188號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.44561,
      PositionLat: 25.05924,
      GeoHash: "wsqqe9cux",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "泰山區",
    LocationTownCode: "65000160",
  },
  {
    StationUID: "TYMC-A5",
    StationID: "A5",
    StationName: {
      Zh_tw: "泰山站",
      En: "Taishan Station",
      Ja: "泰山駅",
      Ko: "타이산 역",
    },
    StationAddress: "新北市泰山區新北大道四段431號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.43943,
      PositionLat: 25.05321,
      GeoHash: "wsqqe2v3x",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "泰山區",
    LocationTownCode: "65000160",
  },
  {
    StationUID: "TYMC-A6",
    StationID: "A6",
    StationName: {
      Zh_tw: "泰山貴和站",
      En: "Taishan Guihe Station",
      Ja: "泰山貴和駅",
      Ko: "타이산 구이허 역",
    },
    StationAddress: "新北市泰山區新北大道六段460號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.42262,
      PositionLat: 25.03321,
      GeoHash: "wsqq7j1m0",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "泰山區",
    LocationTownCode: "65000160",
  },
  {
    StationUID: "TYMC-A7",
    StationID: "A7",
    StationName: {
      Zh_tw: "體育大學站",
      En: "National Taiwan Sport University Station",
      Ja: "体育大学駅",
      Ko: "국립 체육대학교 역",
    },
    StationAddress: "桃園市龜山區文化一路688號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.38543,
      PositionLat: 25.04124,
      GeoHash: "wsqq6nw5v",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "龜山區",
    LocationTownCode: "68000070",
  },
  {
    StationUID: "TYMC-A8",
    StationID: "A8",
    StationName: {
      Zh_tw: "長庚醫院站",
      En: "Chang Gung Memorial Hospital Station",
      Ja: "長庚病院駅",
      Ko: "창겅병원 역",
    },
    StationAddress: "桃園市龜山區文化一路6號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.37073,
      PositionLat: 25.06053,
      GeoHash: "wsqq9f5kn",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "龜山區",
    LocationTownCode: "68000070",
  },
  {
    StationUID: "TYMC-A9",
    StationID: "A9",
    StationName: {
      Zh_tw: "林口站",
      En: "Linkou Station",
      Ja: "林口駅",
      Ko: "린커우 역",
    },
    StationAddress: "新北市林口區八德路290號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.36134,
      PositionLat: 25.0658,
      GeoHash: "wsqq9ehdu",
    },
    LocationCity: "新北市",
    LocationCityCode: "NWT",
    LocationTown: "林口區",
    LocationTownCode: "65000170",
  },
  {
    StationUID: "TYMC-A10",
    StationID: "A10",
    StationName: {
      Zh_tw: "山鼻站",
      En: "Shanbi Station",
      Ja: "山鼻駅",
      Ko: "산비 역",
    },
    StationAddress: "桃園市蘆竹區南山路三段155號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.28476,
      PositionLat: 25.0808,
      GeoHash: "wsqnxvuf5",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "蘆竹區",
    LocationTownCode: "68000050",
  },
  {
    StationUID: "TYMC-A11",
    StationID: "A11",
    StationName: {
      Zh_tw: "坑口站",
      En: "Kengkou Station",
      Ja: "坑口駅",
      Ko: "컹커우 역",
    },
    StationAddress: "桃園市蘆竹區坑菓路460號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.26637,
      PositionLat: 25.08646,
      GeoHash: "wsqnxqz7p",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "蘆竹區",
    LocationTownCode: "68000050",
  },
  {
    StationUID: "TYMC-A12",
    StationID: "A12",
    StationName: {
      Zh_tw: "機場第一航廈站",
      En: "Airport Terminal 1 Station",
      Ja: "空港第1ターミナル駅",
      Ko: "공항 터미널 1 역",
    },
    StationAddress: "桃園市大園區航站南路17之1號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.23783,
      PositionLat: 25.0814,
      GeoHash: "wsqnwvftw",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A13",
    StationID: "A13",
    StationName: {
      Zh_tw: "機場第二航廈站",
      En: "Airport Terminal 2 Station",
      Ja: "空港第2ターミナル駅",
      Ko: "공항 터미널 2 역",
    },
    StationAddress: "桃園市大園區航站南路9號地下一層之1號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.23213,
      PositionLat: 25.07735,
      GeoHash: "wsqnwtnw1",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A14a",
    StationID: "A14a",
    StationName: {
      Zh_tw: "機場旅館站",
      En: "Airport Hotel Station",
      Ja: "空港ホテル駅",
      Ko: "공항호텔 역",
    },
    StationAddress: "桃園市大園區航站南路1之2號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.22142,
      PositionLat: 25.07007,
      GeoHash: "wsqnw7yex",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A15",
    StationID: "A15",
    StationName: {
      Zh_tw: "大園站",
      En: "Dayuan Station",
      Ja: "大園駅",
      Ko: "다위안 역",
    },
    StationAddress: "桃園市大園區橫湳一路50號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.21048,
      PositionLat: 25.05595,
      GeoHash: "wsqnw1qc2",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A16",
    StationID: "A16",
    StationName: {
      Zh_tw: "橫山站",
      En: "Hengshan Station",
      Ja: "橫山駅",
      Ko: "헝산 역",
    },
    StationAddress: "桃園市大園區大竹南路1180號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.21556,
      PositionLat: 25.03665,
      GeoHash: "wsqnqmf3p",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A17",
    StationID: "A17",
    StationName: {
      Zh_tw: "領航站",
      En: "Linghang Station",
      Ja: "領航駅",
      Ko: "링항 역",
    },
    StationAddress: "桃園市大園區橫峰里37鄰領航北路四段351號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.22095,
      PositionLat: 25.02417,
      GeoHash: "wsqnq7w2k",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "大園區",
    LocationTownCode: "68000060",
  },
  {
    StationUID: "TYMC-A18",
    StationID: "A18",
    StationName: {
      Zh_tw: "高鐵桃園站",
      En: "Taoyuan HSR Station",
      Ja: "高鉄桃園駅",
      Ko: "타오위안 고속철도 역",
    },
    StationAddress: "桃園市中壢區青埔里2鄰高鐵北路一段5號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.21406,
      PositionLat: 25.01374,
      GeoHash: "wsqnq397s",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
  {
    StationUID: "TYMC-A19",
    StationID: "A19",
    StationName: {
      Zh_tw: "桃園體育園區站",
      En: "Taoyuan Sports Park Station",
      Ja: "桃園体育園区駅",
      Ko: "타오위안 체육 공원 역",
    },
    StationAddress: "桃園市中壢區芝芭里1鄰高鐵南路二段350號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.20349,
      PositionLat: 25.00199,
      GeoHash: "wsqnnp3xn",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
  {
    StationUID: "TYMC-A20",
    StationID: "A20",
    StationName: {
      Zh_tw: "興南站",
      En: "Xingnan Station",
      Ja: "興南駅",
      Ko: "싱난 역",
    },
    StationAddress: "桃園市中壢區興和里6鄰中豐北路一段685號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.21627,
      PositionLat: 24.98025,
      GeoHash: "wsqnn7dbx",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
  {
    StationUID: "TYMC-A21",
    StationID: "A21",
    StationName: {
      Zh_tw: "環北站",
      En: "Huanbei Station",
      Ja: "環北駅",
      Ko: "환베이 역",
    },
    StationAddress: "桃園市中壢區中豐北路一段26號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.22114,
      PositionLat: 24.96722,
      GeoHash: "wsqnn3ns9",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
  {
    StationUID: "TYMC-A22",
    StationID: "A22",
    StationName: {
      Zh_tw: "老街溪站",
      En: "Laojie River Station",
      Ja: "老街溪駅",
      Ko: "라오제시 역",
    },
    StationAddress: "桃園市中壢區中豐路289號",
    BikeAllowOnHoliday: true,
    SrcUpdateTime: "2023-07-31T00:00:00+08:00",
    UpdateTime: "2023-08-10T12:00:00+08:00",
    VersionID: 3,
    StationPosition: {
      PositionLon: 121.21936,
      PositionLat: 24.95823,
      GeoHash: "wsqjyrt0p",
    },
    LocationCity: "桃園市",
    LocationCityCode: "TAO",
    LocationTown: "中壢區",
    LocationTownCode: "68000020",
  },
];

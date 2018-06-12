
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
	'sunny': '#bbf0ff',
	'cloudy': '#d6eff9',
	'overcast': '#c2ced3',
	'lightrain': '#b0d7e4',
	'heavyrain': '#c1ccd1',
	'snow': '#87e4ff'
 }

Page({
	data: {
		nowTemp: '',
		nowWeather: '',
		nowWeatherBg: '',
		hourlyWeather: [],
		todayTemp: '',
		todayDate: ''
	},

	onPullDownRefresh() {
		this.getNowData(() => {
			wx.stopPullDownRefresh();
		});
	},

	onLoad() {
		this.getNowData();
	},

	getNowData(callback) {
		wx.request({
			url: 'https://test-miniprogram.com/api/weather/now',
			data: {
				city: 'wuhan'
			},
			method: 'GET',
			success: res => {
				let result = res.data.result;
				// 设置现在的气温
				this.setNow(result);
				// 未来24小时的天气
				this.setHourWeather(result);
				// 今天的最低和最高气温
				this.setToday(result);
			},
			complete: () => {
				callback && callback();
			}
		})
	},

	setNow(result) {
		let temp = result.now.temp;
		let weather = result.now.weather;

		this.setData({
			nowTemp: `${temp}°`,
			nowWeather: weatherMap[weather],
			nowWeatherBg: `../../images/${weather}-bg.png`,
		})

		wx.setNavigationBarColor({
			frontColor: '#000000',
			backgroundColor: weatherColorMap[weather]
		})
	},
	
	setHourWeather(result) {
		let forecast = result.forecast;
		let hourlyWeather = [];
		let nowHour = new Date().getHours();
		for (let i = 0; i < 8; i++) {
			hourlyWeather.push({
				time: (i * 3 + nowHour) % 24 + '时',
				iconPath: `../../images/${forecast[i].weather}-icon.png`,
				temp: `${forecast[i].temp}°`
			})
		}
		hourlyWeather[0].time = '现在';

		this.setData({
			hourlyWeather: hourlyWeather
		})
	},

	setToday(result) {
		let date = new Date();

		this.setData({
			todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
			todayDate: `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()} 今天`
		})
	},

	onTapTodayWeather() {
		wx.showToast();		
	}
})

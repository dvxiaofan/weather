
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

const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

const UNPROMPTED = 0;
const UNAUTHORIZED = 1;
const AUTHORIZED = 2;

const UNPROMPTED_TIPS = '点击获取当前城市';
const UNAUTHORIZED_TIPS = '点击开启位置权限';
const AUTHORIZED_TIPS = '';

Page({
	data: {
		nowTemp: '',
		nowWeather: '',
		nowWeatherBg: '',
		hourlyWeather: [],
		todayTemp: '',
		todayDate: '',
		city: '北京市',
		locationAuthType: UNPROMPTED,
		locationTipsText: UNPROMPTED_TIPS
		
	},

	onPullDownRefresh() {
		this.getNowData(() => {
			wx.stopPullDownRefresh();
		});
	},

	onLoad() {
		this.qqmapsdk = new QQMapWX({
			key: '6M7BZ-43ORO-A7QW7-SA7B7-QEFX3-SJFYX'
		}); 

		this.getNowData();
	},

	// 获取当前城市
	onTapLocation() {

		if (this.data.locationAuthType === UNAUTHORIZED) 
			wx.openSetting({
				success: res => {
					let auth = res.authSetting['scope.userLocation']

					if (auth) {
						this.getCityAndWeather();
					}
					
				}
			})
		else 
			this.getCityAndWeather()

	},

	getCityAndWeather() {
		wx.getLocation({
			success: res => {
				this.setData({
					locationAuthType: AUTHORIZED,
					locationTipsText: AUTHORIZED_TIPS
				})
				this.qqmapsdk.reverseGeocoder({
					location: {
						latitude: res.latitude,
						longitude: res.longitude
					},
					success: res => {
						let city = res.result.address_component.city;

						this.setData({
							city: city,
							locationTipsText: ''
						})
						this.getNowData();
					}
				})
			},
			fail: () => {
				this.setData({
					locationAuthType: UNAUTHORIZED,
					locationTipsText: UNAUTHORIZED_TIPS
				})
			}
		})
	},

	getNowData(callback) {
		wx.request({
			url: 'https://test-miniprogram.com/api/weather/now',
			data: {
				city: this.data.city
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
		wx.navigateTo({
			// 传递city参数给第二个页面
			url: '../list/list?city='+this.data.city
		})		
	}
})

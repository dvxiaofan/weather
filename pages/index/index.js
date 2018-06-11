
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
		forecast: ['现在', '17时', '20时', '23时', '2时', '5时']
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
				let temp = result.now.temp;
				let weather = result.now.weather;
				
				this.setData({
					nowTemp: `${temp}°`,
					nowWeather: weatherMap[weather],
					nowWeatherBg: `../../images/${weather}-bg.png`
				})

				wx.setNavigationBarColor({
					frontColor: '#000000',
					backgroundColor: weatherColorMap[weather]
				})
			},
			complete: () => {
				callback && callback();
			}
		})
	}
})

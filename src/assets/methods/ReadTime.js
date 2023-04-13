import moment from 'moment'

const readTime = {
  getTime (time) {
    if (time) {
      const theDate = new Date(time * 1000).toISOString().split('T')
      return moment(theDate[0]).format('YYYY/MM/DD')
    } else if (time === undefined) {
      return '未付款或時間錯誤'
    }
  }
}
export default readTime
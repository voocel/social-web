const obj = {
  getCurTime(type = 0) {
    const myDate = new Date()
    const year = myDate.getFullYear()
    let month = myDate.getMonth() + 1
    let date = myDate.getDate()
    let hour = myDate.getHours()
    let minute = myDate.getMinutes()
    let s = myDate.getSeconds()
    if (date < 10) date = '0' + date
    if (month < 10) month = '0' + month
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (s < 10) s = '0' + s
    if (type === 1) {
      return month + '/' + date
    }
    return (
      year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + s
    )
  }
}
export default obj

const route = {
  'HEARBEAT': 1,
  'AUTH': 2,
  'CONNECT': 3,
  'DISCONNECT': 4,
  'MESSAGE': 5,
  'GROUP_MESSAGE': 6,
  'SYSTEM': 7
}

const contentType = {
  'TEXT': 1,
  'FILE': 2,
  'IMAGE': 3,
  'AUDIO': 4,
  'VIDEO': 5
}

// message = seq(2byte)+route(4byte)+data
// decodeURIComponent(escape(String.fromCharCode.apply(null, ab)))
const message = {
  pack(route, data) {
    const str = JSON.stringify(data)
    var strUtf8 = unescape(encodeURIComponent(str))
    const dataLen = strUtf8.length
    const buf = new ArrayBuffer(dataLen + 6)
    const bufView = new DataView(buf)
    bufView.setUint16(0, 1, true)
    bufView.setUint32(2, route, true)
    for (var i = 0; i < dataLen; i++) {
      bufView.setUint8(i + 6, strUtf8.codePointAt(i))
    }
    return buf
  },

  unpack(ab) {
    const bufView = new DataView(ab, 0, 6)
    const seq = bufView.getUint16(0, true)
    const route = bufView.getUint32(2, true)

    const dv = new DataView(ab, 6)
    const decoder = new TextDecoder('utf-8')
    const data = decoder.decode(dv)
    let dataJson
    if (data.length !== 0) {
      dataJson = JSON.parse(data)
    }
    const result = {
      seq: seq,
      route: route,
      data: dataJson
    }
    return result
  }
}

export { message, route, contentType }

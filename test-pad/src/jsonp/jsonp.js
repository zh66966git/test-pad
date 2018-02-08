import originJsonp from 'jsonp'
 function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

 function param(data){
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
let options='cb';
export function getRecommend(cid,bid,keyw) {
  const url = 'http://apis-tj.map.qq.com/ws/indoor/v1/suggestion';

  const data = Object.assign({}, {
    building_id:bid,
    region:cid,
    keyword: keyw,
    page_index:1,
    key:'EAUBZ-J4PRU-JQYVE-B7VGD-TP3JK-APFAI',
    output:'jsonp',
  });

  return jsonp(url, data, options)
}

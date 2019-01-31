const string = require("./string.js");

const cjLogistics = (data) => {
  const STATUS_MAP = {
    null: {id: 'information_received', text:'상품준비중'},
    11: {id: 'at_pickup', text:'상품인수'},
    41: {id: 'in_transit', text:'상품이동중'},
    42: {id: 'in_transit', text:'상품이동중'}, // 원래는 배송지 도착이지만 제공하지 않음 (표준화)
    44: {id: 'in_transit', text:'상품이동중'},
    82: {id: 'out_for_delivery', text:'배송출발'},
    91: {id: 'delivered', text:'배달완료'},
  }
  
  const deliverDetailList = data.parcelDetailResultMap.resultList;
  
  let result = {
    deliveryInfo : {
      sender: data.parcelResultMap.resultList[0].sendrNm,
      recipient: data.parcelResultMap.resultList[0].rcvrNm
    },
    deliveryDetailInfo : []
  }
  
  for(const info of deliverDetailList){
    result.deliveryDetailInfo.push({
      message: info.crgNm,
      time: `${info.dTime}00`,
      location: info.regBranNm,
      status: STATUS_MAP[info.crgSt].text,
      action: info.scanNm
    });
  }
  
  
  return result;
}

const hanjin = ($,$info,$list) => {
  const sender = $info.eq(3).find('span').text();
  const recipient = $info.eq(4).find('span').text();
  
  let result = {
    deliveryInfo : {
      sender: sender,
      recipient: recipient,
    },
    deliveryDetailInfo : []
  }
  
  $list.each((index,elem) => {
    if($list.length - 1 == index){
      return false;
    }
    const $td = $(elem).find('td');
    
    result.deliveryDetailInfo.push({
      message: '',
      time: `${$td.eq(0).text()} ${$td.eq(1).text()}:00.000`,
      location: $td.eq(2).text(),
      status: $td.eq(3).text().trim(),
      action: $td.eq(3).text().trim()
    });
    
  });
  
  return result;
}


const epost = ($,$info,$list) => {
  const sender = string.unicode16ToStr($info.find('td').eq(0).html()).split('<br>');
  const recipient = string.unicode16ToStr($info.find('td').eq(1).html()).split('<br>');
  
  let result = {
    deliveryInfo : {
      sender: sender,
      recipient: recipient,
    },
    deliveryDetailInfo : []
  }
  
  
  $list.each((index,elem) => {
    const $td = $(elem).find('td');
    
    result.deliveryDetailInfo.push({
      message: '',
      time: `${$td.eq(0).text()} ${$td.eq(1).text()}:00+09:00`,
      location: $td.eq(2).text(),
      status: $td.eq(3).text().trim(),
      action: $td.eq(3).text().trim()
    });
    
  });
  
  return result;
}


exports.hanjin = hanjin;
exports.epost = epost;
exports.cjLogistics = cjLogistics;
const axios = require("../../lib/axios");
const qs = require('querystring');
const cheerio = require("cheerio");
const deliveryParser = require('./delivery-parser');
const iconv = require('iconv-lite');
const Errors = require('../errors/errors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const getTrack = {
  "kr" : {
    "cjlogistics" : async (trackId,callback) => {
      if(!/^(\d{10}(\d{2})?)?$/.test(trackId)) {
        const err = new Errors.DeliveryValidationError('운송장 번호는 10자리 혹은 12자리입니다.');
        throw err;
      }
      
      let res = await axios.get('https://www.cjlogistics.com/ko/tool/parcel/tracking');
      
      const cookie = res.headers['set-cookie'].map(c => c.match(/\S+=\S+;/)[0]);
      const csrf = res.data.match(/\S{8}-\S{4}-\S{4}-\S{4}-\S{12}/)[0];
      
      res = await axios.post('https://www.cjlogistics.com/ko/tool/parcel/tracking-detail', qs.stringify({
              paramInvcNo: trackId,
              _csrf: csrf
            }), {
              headers: {
                Cookie: cookie
              }
            });
      
      if(res.data.parcelResultMap.resultList.length == 0){
        return {'message':'해당 운송장이 존재하지 않습니다.'};
      }
      
      res.data.parcelDetailResultMap.resultList.reverse();
      const result = deliveryParser.cjLogistics(res.data);
      
      return result;
    },
    "epost" : async (trackId,callback) => {
      if(!/^(\d{13})?$/.test(trackId)) {
        const err = new Errors.DeliveryValidationError('운송장 번호는 13자리입니다.');
        throw err;
      }

      const res = await axios.post('https://service.epost.go.kr/trace.RetrieveDomRigiTraceList.comm?displayHeader=N', qs.stringify({
        sid1: trackId
      }));
      const $ = cheerio.load(res.data);
      
      
      const $trackList = $('.table_col').eq(1).find('tbody').find('tr');
      const $trackInfo = $('.table_col').eq(0).find('tbody').find('tr');
      
      if($trackList.length == 0){
        return {'message':'해당 운송장이 존재하지 않습니다.'};
      }
      
      const result = deliveryParser.epost($,$trackInfo,$trackList,trackId);

      return result;
    },
    "hanjin": async (trackId,callback) => {
      if(!/^(\d{10}(\d{2})?)?$/.test(trackId)) {
        const err = new Errors.DeliveryValidationError('운송장 번호는 10자리 혹은 12자리입니다.');
        throw err;
      }
      
      if(parseInt(trackId.substring(0, trackId.length - 1)) % 7 !== parseInt(trackId.substring(trackId.length - 1))){
        const err = new Errors.DeliveryValidationError('잘못된 운송장 번호입니다.');
        throw err;
      }

      const res = await axios.post(`https://www.hanjin.co.kr/Delivery_html/inquiry/result_waybill.jsp?wbl_num=${trackId}`,
      qs.stringify({
        sel_wbl_num1: 0,
        wbl_num: trackId
      }),{isEncoding:false});

      const encodingHtml = iconv.decode(res.data, 'EUC-KR'); // 획득한 charset값으로 body를 디코딩
      const $ = cheerio.load(encodingHtml);

      const $table = $('#result_waybill2').find('table');
      const $trackInfo = $table.eq(0).find('tbody').find('tr').find('td');
      const $trackList = $table.eq(1).find('tbody').find('tr');

      if($('.resulte_context').find('p.noData').length == 1){
        return {'message':'해당 운송장이 존재하지 않습니다.'};
      } 

      const result = deliveryParser.hanjin($,$trackInfo,$trackList,trackId);

      return result;
    }
  },
  null : (trackId,callback) => {
    return;
  }
  
}
exports.getTrack = getTrack;
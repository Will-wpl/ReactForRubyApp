import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import RetailerRanking from '../../app/webpack/components/admin/admin_shared/ranking';

const setup = () => {
  // 模拟 props
  const props = {
    ranking:[{
      "id": 6,
      "average_price": "0.122211797241865731202553966",
      "lt_peak": "0.123",
      "lt_off_peak": "0.123",
      "hts_peak": "0.0",
      "hts_off_peak": "0.0",
      "htl_peak": "0.1215",
      "htl_off_peak": "0.12",
      "bid_time": "2017-11-29T02:44:04.329Z",
      "user_id": 14,
      "auction_id": 1,
      "created_at": "2017-11-29T02:44:04.354Z",
      "updated_at": "2017-11-29T02:44:04.392Z",
      "total_award_sum": "829635.03",
      "ranking": 1,
      "is_bidder": true,
      "flag": "899f8d02-4617-4b8f-9131-2b658851cf04",
      "actual_bid_time": "2017-11-29T02:44:04.329Z",
      "company_name": "Union Power"
  }]
    // Jest 提供的mock 函数
    // onAddClick: jest.fn( (e) => {
    // })
  }

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<RetailerRanking ranking={props.ranking} />)
  return {
    props,
    wrapper
  }
}

describe('RetailerRanking', () => {
  const { wrapper, props } = setup();
  it('RetailerRanking Component should render', () => {
    expect(wrapper.find('h3').text()).toEqual('Retailer Ranking');
  });

  it('RetailerRanking Component have data', () => {
    expect(props.ranking[0].company_name).toEqual('Union Power');
    expect(props.ranking[0].total_award_sum).toEqual('829635.03');
    expect(props.ranking[0].is_bidder).toBeTruthy();
  });
})




















// const setup = () => {
//   // 模拟 props
//   const props = {
//     // Jest 提供的mock 函数
//     onAddClick: jest.fn()
//   }

//   // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
// const wrapper = shallow(<RetailerRanking {...props} />)
//   return {
//     props,
//     wrapper
//   }
// }
// describe('CreateNewRADom', () => {
//   const { wrapper, props } = setup();
//   it('CreateNewRADom Component should be render', () => {
//     expect(wrapper.find('table').exists());
//   })
// })
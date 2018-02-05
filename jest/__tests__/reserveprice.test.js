import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import ReservePrice from '../../app/webpack/components/admin/admin_shared/reserveprice';

const setup = () => {
  // 模拟 props
  const props = {
    name:"testPrice Name",
    price:0.1458,
    realtimePrice:0.1425
    // Jest 提供的mock 函数
    // onAddClick: jest.fn( (e) => {
    // })
  }

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<ReservePrice name={props.name} price={props.price} realtimePrice={props.realtimePrice} />)
  return {
    props,
    wrapper
  }
}

describe('ReservePrice', () => {
  const { wrapper, props } = setup();
  it('ReservePrice Component should render', () => {
    expect(wrapper.find('#reservePrice_name').text()).toEqual('testPrice Name');
  });

  it('ReservePrice if realtimePrice <= price the reservePrice span className is success and show Reserve Price Achieved', () => {
    expect(wrapper.find('.reservePrice dd span.success').text()).toEqual('Reserve Price Achieved');
  });
  // it('ReservePrice if realtimePrice > price the reservePrice span className is fail and show Reserve Price Achieved', () => {
  //   expect(wrapper.find('.reservePrice dd span.fail').text()).toEqual('Reserve Price Not Achieved');
  // });
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
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import BidHistory from '../../app/webpack/components/retailer/live-dashboard/bid-history';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    data:[
      {bid_time:'2017-12-10',lt_peak:'0.4113',lt_off_peak:'0.4113',htl_peak:'0.4111',htl_off_peak:'0.4113'},
      {bid_time:'2017-12-11',lt_peak:'0.4113',lt_off_peak:'0.4113',htl_peak:'0.4111',htl_off_peak:'0.4113'},
      {bid_time:'2017-12-12',lt_peak:'0.4113',lt_off_peak:'0.4113',htl_peak:'0.4111',htl_off_peak:'0.4113'},
      {bid_time:'2017-12-13',lt_peak:'0.4113',lt_off_peak:'0.4113',htl_peak:'0.4111',htl_off_peak:'0.4113'}
    ]
  }

  const wrapper = shallow(<BidHistory {...props} />)
  return {
    props,
    wrapper
  }
}

// const shallowRender = (Component) => {
//   const renderer = TestUtils.createRenderer();
//   renderer.render(<Component/>);
//   return renderer.getRenderOutput();
// }

describe('BidHistory', () => {
  const { wrapper, props } = setup();
  it('BidHistory Component should render', () => {
    expect(wrapper.find('.table-head').exists());
  });

  it('BidHistory Component data have 4', () => {
    expect(props.data.length).toEqual(4);
  });
  
  // const component = shallowRender(<BidForm />);
  // component.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
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
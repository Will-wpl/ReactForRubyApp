import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import {CounterDownShowBeforeLive} from '../../app/webpack/components/shared/before-live-counterdown';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    auction: {
      start_datetime: '',
      name: 'test-for-timecountdown'
    },
    day: 2,
    hour: 5,
    minute: 35,
    second: 24,
    isHold: true
  }

  const wrapper = shallow(<CounterDownShowBeforeLive {...props} />)
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

describe('CounterDownShowBeforeLive', () => {
  const { wrapper, props } = setup();
  it('CounterDownShowBeforeLive Component should render', () => {
    expect(wrapper.find('.time_cuntdown').exists());
  });

  it('if the hold status is hold. this page will show information', () => {
    if(props.isHold){
      expect(props.isHold).toBeTruthy();
    }else{
      expect(props.isHold).toBeFalsy()
    }
    expect(wrapper.find('#retailer_hold b').text()).toEqual('Reverse Auction has been put on hold due to an emergency situation. Reverse Auction will commence immediately once situation clears. Please continue to standby for commencement.');
  });

  it('CounterDownShowBeforeLive Component props data should render', () => {
    expect(wrapper.find('#countdown_timer_day').text()).toEqual("2");
    expect(wrapper.find('#countdown_timer_hour').text()).toEqual("5");
    expect(wrapper.find('#countdown_timer_minute').text()).toEqual("35");
    expect(wrapper.find('#countdown_timer_second').text()).toEqual("24");
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
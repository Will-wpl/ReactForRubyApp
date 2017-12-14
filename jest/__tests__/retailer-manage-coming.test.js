import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow } from 'enzyme';
require("babel-polyfill");
import {RetailerManage} from '../../app/webpack/components/retailer/retailer-manage-coming';
//import TestUtils from 'react-addons-test-utils';
//BidForm.initConfigs([0.1458,0.1458,0,0,0.1458,0.1458]);
const setup = () => {
  // 模拟 props
  const props = {
    onSubmitjest: jest.fn((e) => {
    }),
    main:{
      id:1,
      main_name:"hermann",
      main_email_address:"hermann@unionpower.com.sg",
      main_mobile_number:"12345678",
      main_office_number:"12345678",
      alternative_name:"hermann",
      alternative_email_address:"hermannunionpower.com.sg",
      alternative_mobile_number:"1234567",
      alternative_office_number:"12345678"
    },
    pubStatusJest:1,
    doJest:true
  }

  const wrapper = shallow(<RetailerManage {...props} />)
  return {
    props,
    wrapper
  }
}


describe('RetailerManage', () => {
  const { wrapper, props } = setup();
  it('RetailerManage Component should render', () => {
    expect(wrapper.find('.retailer_manage_coming').exists());
  });

  it('if the publishStatus is published the live_modal will be hide and retailer_form of Component should be show', () => {
    expect(wrapper.find('#live_modal').hasClass('live_hide'));
    expect(wrapper.find('#retailer_form').hasClass('live_show'));
  });
  
  it('Regular validation of form fields', () => {
    expect(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi.test(props.main.main_email_address)).toBeTruthy();
    expect(/^(\d{8})$/gi.test(props.main.main_mobile_number)).toBeTruthy();
    expect(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi.test(props.main.alternative_email_address)).toBeFalsy();
    expect(/^(\d{8})$/gi.test(props.main.alternative_mobile_number)).toBeFalsy();
  })
  it('if click submit the checkSuccess function should be called', () => {
    const mockEvent = {
      key: 'Submit',
    }
    wrapper.find('form').simulate('submit', mockEvent);
    expect(props.onSubmitjest).toBeCalled();
  })
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
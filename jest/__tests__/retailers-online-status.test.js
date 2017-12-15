import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import {RetailsOnlineStatus} from '../../app/webpack/components/admin/admin_shared/retailers-online-status';

const setup = () => {
  // 模拟 props
  const props = {
    list_data:[
      {company_name:"company name1",onlineStatus:"on",id:10}
    ],
    showDetail: jest.fn(),
    onAddturly:'jest'
  }

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<RetailsOnlineStatus {...props} />)
  return {
    props,
    wrapper
  }
}

describe('RetailsOnlineStatus', () => {
  const { wrapper, props } = setup();
  it('RetailsOnlineStatus Component should render', () => {
    expect(wrapper.find('.bidders_list').exists());
  });
  it('RetailsOnlineStatus Component have data', () => {
    expect(props.list_data[0].company_name).toEqual('company name1');
    expect(props.list_data[0].onlineStatus).toEqual('on');
    expect(props.list_data[0].id).toEqual(10);
  });
  it('When click the showDetail, showDetail of function shoule be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('.bidders_list .showclick').simulate('click',mockEvent);
    expect(props.showDetail).toBeCalled()
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
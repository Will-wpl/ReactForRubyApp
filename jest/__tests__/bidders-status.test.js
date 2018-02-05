import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import {BidderStatus} from '../../app/webpack/components/admin/admin_shared/bidders-status';

const setup = () => {
  // 模拟 props
  const props = {
    dataList:[
      {company_name:"company name1",accept_status:false,id:10},
      {company_name:"company name2",accept_status:true,id:15},
      {company_name:"company name3",accept_status:true,id:16}
    ],
    onAddClick: jest.fn(),
    onAddturly:'jest'
  }

  // 通过 enzyme 提供的 shallow(浅渲染) 创建组件
  const wrapper = shallow(<BidderStatus {...props} />)
  return {
    props,
    wrapper
  }
}

describe('BidderStatus', () => {
  const { wrapper, props } = setup();
  it('BidderStatus Component should render', () => {
    expect(wrapper.find('h3').text()).toEqual('Bidders Status of Submission');
  });
  it('BidderStatus Component have data', () => {
    expect(props.dataList[0].company_name).toEqual('company name1');
    expect(props.dataList[1].accept_status).toBeTruthy();
    expect(props.dataList[2].id).toEqual(16);
  });
  it('When click the showDetail, showDetail of function shoule be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('#showDetail').simulate('click',mockEvent);
    expect(props.onAddClick).toBeCalled()
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
import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import {SearchList} from '../../app/webpack/components/search/searchOrlist/search-list';


const setup = () => {
  // 模拟 props
const props = {
  data:{
    "headers":[
      {"name":"Company Name","field_name":"company_name"},
      {"name":"License Number","field_name":"company_license_number"},
      {"name":"Status","field_name":"approval_status"}
    ],
    "bodies":{"data": [
            {
                "id": 4,
                "name": "Energy Supply Solutions",
                "email": "yap@energysupplysolutions.com.sg",
                "created_at": "2017-12-22T07:29:52.979Z",
                "updated_at": "2017-12-26T01:39:14.461Z",
                "company_name": "Energy Supply Solutions",
                "approval_status": "Approved",
                "consumer_type": null,
                "company_address": null,
                "company_unique_entity_number": null,
                "company_license_number": null,
                "account_fin": null,
                "account_mobile_number": null,
                "account_office_number": null,
                "account_home_number": null,
                "account_housing_type": null,
                "account_home_address": null
            }
        ],"total":1},
    "actions":[
      {"url":"/admin/users/:id/manage","name":"Manage","icon":"lm--icon-search"}
    ]},
    onAddClick: jest.fn( (e) => {
    })
}

const wrapper = shallow(<SearchList {...props} />)
  return {
    props,
    wrapper
  }
}

describe('SearchList', () => {
  const { wrapper, props } = setup();
  it('SearchList Component should render', () => {
    expect(wrapper.find('.lm--table-container').exists());
  });
  
  it('SearchList Component have data', () => {
    expect(props.data.headers[0].field_name).toEqual('Company Name');
    expect(props.data.headers[1].name).toEqual('License Number');
  })
  it('SearchList tbody data Rely on the headers', () => {
    expect(props.data.bodies.data[0][""+props.data.headers[0].name+""]).toEqual('Energy Supply Solutions');
  })
  it('if you click table_page button the dosearch() will be called', () => {
    const mockEvent = {
      key: 'Click',
    }
    wrapper.find('.table_page span').simulate('click',mockEvent);
    expect(props.onAddClick).toBeCalled()
  })
})






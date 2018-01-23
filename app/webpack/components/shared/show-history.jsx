import React, { Component } from 'react';
export class Showhistory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modalshowhide:"modal_hide",
            type:'default',
            secondStatus:"live_hide",
            props_data:{}
        }
    }
    showModal(data){
        this.setState({
            modalshowhide:"modal_show",
            props_data:data?data:{}
        })
    }
    closeModal(){
        this.setState({
            modalshowhide:"modal_hide"
        })
    }
    componentDidMount() {
         
    }
    render(){
        return(
            <div id="modal_history" className={this.state.modalshowhide}>
                <dl>
                    <h4><span>History</span><a onClick={this.closeModal.bind(this)}>X</a></h4>
                    <dd>
                        <dfn><abbr></abbr>Retailer</dfn>
                        <span>1231132131311111111111111111111111
                            222222222222222222222222222222222
                            22222222222222222222
                        </span>
                    </dd>
                    <dt>
                        <dfn><abbr></abbr>SP</dfn>
                        <span>45464646464</span>
                    </dt>
                </dl>
            </div>
        )
    }
}
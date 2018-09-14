import React, {Component} from 'react';

export default class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configs: ['', '', '', '', '', '', '', ''],
            changed: true,
            samePrice: false,
            thisStatus: false,
            status: [true, true, true, true, true, true, true, true],
            answered: true
        }
        this.compareConfigs = ['9999', '9999', '9999', '9999', '9999', '9999', '9999', '9999'];
    }

    initConfigs(configs) {
        //console.log('initial config', configs);
        this.compareConfigs = configs.map(element => {
            return parseFloat(element).toFixed(4).substring(2);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.length > 0) {
            this.compareConfigs = nextProps.data.map(element => {
                return parseFloat(element).toFixed(4).substring(2);
            });
            this.setState({
                configs: JSON.parse(JSON.stringify(this.compareConfigs)), status: this.state.status.map(element => {
                    return true;
                }), answered: true
            });
        }
    }

    onInputChanged(i, e) {
        let formatNum = e.target.value.replace(/\D/, '');
        let target = this.compareConfigs.find((element, index) => {
            return index === i;
        });
        let status = this.state.status;
        if (formatNum === '' || Number(`0.${formatNum}`) <= Number(`0.${target}`)) {
            status[i] = true;
        } else {
            status[i] = false;
        }
        this.setState({
            configs: this.state.configs.map((element, index) => {
                if (index === i) {
                    element = formatNum;
                }
                return element;
            }), status: status
        });
    }

    onSubmit() {
        if(this.props.onSubmitjest){
            this.props.onSubmitjest();
        }
        this.setState({
            thisStatus: true
        })
        if(!this.compareConfigs){
            return;
        }
        const mapping = {
            0:this.props.isLtVisible,1:this.props.isLtVisible,
            2:this.props.isHtsVisible,3:this.props.isHtsVisible,
            4:this.props.isHtlVisible,5:this.props.isHtlVisible,
            6:this.props.isEhtVisible,7:this.props.isEhtVisible
        }
        let allow = this.state.configs.every((element, index) => {
            if (!mapping[index])
                return true;
            return element.length > 0 && Number(element) !== 0 && Number(`0.${element}`) <= Number(`0.${this.compareConfigs[index]}`);
        })
        let isChanged = this.state.configs.some((element, index) => {
            if (!mapping[index])
                return false;
            return Number(`0.${element}`) < Number(`0.${this.compareConfigs[index]}`);
        })
        if (allow && isChanged) {
            if (this.props.onSubmit) {
                let params = this.state.configs.map(element => {
                    return element;
                });
                const coupleNum = 2;
                const replaceELes = ["0", "0"];
                if (!this.props.isLtVisible) {
                    params.splice(0, coupleNum, ...replaceELes);
                }
                if (!this.props.isHtsVisible) {
                    params.splice(2, coupleNum, ...replaceELes);
                }
                if (!this.props.isHtlVisible) {
                    params.splice(4, coupleNum, ...replaceELes);
                }
                if (!this.props.isEhtVisible) {
                    params.splice(6, coupleNum, ...replaceELes);
                }
                this.props.onSubmit(params);
                this.setState({answered: false})
            }
            this.setState({
                samePrice: false
            })
            setTimeout(() => {
                this.setState({
                    samePrice: true,
                    thisStatus: false
                })
            }, 5000)
        } else {
            this.setState({
                samePrice: true
            })
            setTimeout(() => {
                this.setState({
                    samePrice: false,
                    thisStatus: false
                })
            }, 5000)
        }
    }

    render() {
        let error_html;
        if (this.state.thisStatus) {
            error_html = !this.state.samePrice ?
                <div className="number_error">Your bid has been successfully submitted.</div>
                : <div className="number_error" style={{color: 'red'}}>Invalid submission. Please check that your submission fulfils the following criteria:<br/><br/>
                    1.	Prices submitted must be lower than the starting price<br/>
                    2.	None of the values should be higher than its previous value<br/>
                    3.	At least one of the values must be lower than its previous value<br/>
                    4.	None of the values should be zero<br/>
                  </div>;
        }
        let illegal;
        if (this.state.status.some(element => {
                return !element
            })) {

            illegal = <div className="number_error" style={{color: 'red'}}>Invalid submission. Please check that your submission fulfils the following criteria:<br/><br/>
                        1.	Prices submitted must be lower than the starting price<br/>
                        2.	None of the values should be higher than its previous value<br/>
                        3.	At least one of the values must be lower than its previous value<br/>
                        4.	None of the values should be zero<br/>
                    </div>;
        }
        return (
            <div className="number_form">
                <form>
                    <h3>Enter My Bids</h3>
                    <table className="retailer_fill u-mt2">
                        <thead>
                        <tr>
                            <th></th>
                            <th style={this.props.isLtVisible ? {} : {display: 'none'}}>
                                <div>LT</div>
                                <div>($/kWh)</div>
                            </th>
                            <th style={this.props.isHtsVisible ? {} : {display: 'none'}}>
                                <div>HTS</div>
                                <div>($/kWh)</div>
                            </th>
                            <th style={this.props.isHtlVisible ? {} : {display: 'none'}}>
                                <div>HTL</div>
                                <div>($/kWh)</div>
                            </th>
                            <th style={this.props.isEhtVisible ? {} : {display: 'none'}}>
                                <div>EHT</div>
                                <div>($/kWh)</div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Peak<br/>(7am-7pm)</td>
                            <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$0.<input type="text" name="peak_lt" value={this.state.configs[1]}
                                          style={{borderColor: this.state.status[1] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 1)}
                                          maxLength={4}/></td>
                            <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$0.<input type="text" name="peak_hts" value={this.state.configs[3]}
                                          style={{borderColor: this.state.status[3] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 3)}
                                          maxLength={4}/></td>
                            <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$0.<input type="text" name="peak_htl" value={this.state.configs[5]}
                                          style={{borderColor: this.state.status[5] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 5)}
                                          maxLength={4}/></td>
                            <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$0.<input type="text" name="peak_eht" value={this.state.configs[7]}
                                           style={{borderColor: this.state.status[7] ? '#ced5dc' : 'red'}}
                                           onChange={this.onInputChanged.bind(this, 7)}
                                           maxLength={4}/></td>
                        </tr>
                        <tr>
                            <td>Off-Peak <br/>(7pm-7am)</td>
                            <td style={this.props.isLtVisible ? {} : {display: 'none'}}>$0.<input type="text" name="off_peak_lt" value={this.state.configs[0]}
                                          style={{borderColor: this.state.status[0] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 0)}
                                          maxLength={4}/></td>
                            <td style={this.props.isHtsVisible ? {} : {display: 'none'}}>$0.<input type="text" name="off_peak_hts" value={this.state.configs[2]}
                                          style={{borderColor: this.state.status[2] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 2)}
                                          maxLength={4}/></td>
                            <td style={this.props.isHtlVisible ? {} : {display: 'none'}}>$0.<input type="text" name="off_peak_htl" value={this.state.configs[4]}
                                          style={{borderColor: this.state.status[4] ? '#ced5dc' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 4)}
                                          maxLength={4}/></td>
                            <td style={this.props.isEhtVisible ? {} : {display: 'none'}}>$0.<input type="text" name="off_peak_eht" value={this.state.configs[6]}
                                           style={{borderColor: this.state.status[6] ? '#ced5dc' : 'red'}}
                                           onChange={this.onInputChanged.bind(this, 6)}
                                           maxLength={4}/></td>
                        </tr>

                        </tbody>
                    </table>
                    {illegal}
                    <button type="button" className="lm--button lm--button--primary u-mt2 fright" disabled={this.state.answered ? false : 'disabled'}
                            onClick={this.onSubmit.bind(this)}>{!this.state.answered ? 'Processing...' : 'Submit'}
                    </button>
                    {error_html}
                </form>
            </div>
        );
    }
}
BidForm.defaultProps = {
    isLtVisible: true,
    isHtsVisible: true,
    isHtlVisible: true,
    isEhtVisible: true
}
BidForm.propTypes = {
    onSubmitjest: ()=>{}
};
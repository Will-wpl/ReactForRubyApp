import React, {Component} from 'react';

export default class BidForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            configs: ['', '', '', '', '', ''],
            changed: true,
            samePrice: false,
            thisStatus: false,
            status: [true, true, true, true, true, true],
            answered: true
        }
    }

    initConfigs(configs) {
        console.log('initial config', configs);
        this.compareConfigs = configs.map(element => {
            return parseFloat(element).toFixed(4).substring(2);
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log('newest config', nextProps.data);
        //alert('newest config', nextProps.data);
        //alert(nextProps.data.length);
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
    componentWillUnmount() {
        //clearInterval(this.configTime);
    }
    componentDidMount() {
        // this.configTime = setTimeout(()=>{
        //     this.refs.configs1.value = this.state.configs[1];
        //     this.refs.configs5.value = this.state.configs[5];
        //     this.refs.configs0.value = this.state.configs[0];
        //     this.refs.configs4.value = this.state.configs[4];
        // },1000)
    }
    onInputChanged(i, e) {
        let formatNum = e.target.value.replace(/\D/, '');
        let target = this.compareConfigs.find((element, index) => {
            return index === i;
        });
        console.log(Number(formatNum), formatNum, target);
        let status = this.state.status;
        if (formatNum !== '' && Number(`0.${formatNum}`) <= Number(`0.${target}`)) {
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
        // let num = parseInt(e.target.value);
        // if (num < 10000) {
        //     if (num > 0) {
        //         num = parseFloat(num * 1.0 / 10000).toFixed(4).substring(2);
        //     } else {
        //         num = '0000';
        //     }
        //     let target = this.compareConfigs.find((element, index) => {
        //         return index === i;
        //     });
        //     let status = this.state.status;
        //     console.log('target ===>', target)
        //     if (target) {
        //         if (Number(num) * 1.0 / 10000 > Number(target)) {
        //             status[i] = false;
        //         } else {
        //             status[i] = true;
        //         }
        //     }
        //     this.setState({
        //         configs: this.state.configs.map((element, index) => {
        //             if (index === i) {
        //                 element = num;
        //             }
        //             return element;
        //         }), status: status
        //     });
        // }
    }

    onSubmit() {
        this.setState({
            thisStatus: true
        })
        let allow = this.state.configs.every((element, index) => {
            if (index === 2 || index === 3) {
                return true;
            }
            return element.length > 0 && Number(`0.${element}`) <= Number(`0.${this.compareConfigs[index]}`);
        })
        let isChanged = this.state.configs.some((element, index) => {
            // console.log("state:" + Number(element) + "--------props:" + Number(this.compareConfigs[index]));
            if (index === 2 || index === 3) {
                return false;
            }
            return Number(`0.${element}`) < Number(`0.${this.compareConfigs[index]}`);
        })
        if (allow && isChanged) {
            if (this.props.onSubmit) {
                let params = this.state.configs.map(element => {
                    return element;
                });
                params.splice(2, 2, "0", "0");
                // console.log(this.state.configs, params);
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
                : <div className="number_error" style={{color: 'red'}}>Invalid submission. Please check that your submission fulfils the following criteria:<br/>
                    <br/>
                    For initial submission:<br/>
                    Prices submitted must be lower than the energy cost component of prevailing SPS LT Tariff ($0.1458/kWh)<br/>
                    <br/>
                    For subsequent submission:<br/>
                    1. None of the values should be higher than its previous value<br/>
                    2. At least one of the values must be lower than its previous value</div>;
        }
        let illegal;
        if (this.state.status.some(element => {
                return !element
            })) {
            // illegal = <p className="number_error" style={{color: 'red'}}>Prices submitted must be lower than the energy cost component of prevailing SPS LT Tariff ($0.1458/kWh)</p>;

            illegal = <p className="number_error" style={{color: 'red'}}>
                Invalid submission. Please check that your submission fulfils the following criteria:<br/>
                <br/>
                For initial submission:<br/>
                Prices submitted must be lower than the energy cost component of prevailing SPS LT Tariff ($0.1458/kWh)<br/>
                <br/>
                For subsequent submission:<br/>
                1. None of the values should be higher than its previous value<br/>
                2. At least one of the values must be lower than its previous value</p>;
        }
        return (
            <div className="number_form">
                <form>
                    <h3>Enter My Bids</h3>
                    <table className="retailer_fill u-mt2">
                        <thead>
                        <tr>
                            <th></th>
                            <th>LT</th>
                            <th style={{display: 'none'}}>HT(Small)</th>
                            <th>HT(Large)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Peak (7am-7pm)</td>
                            <td>$0.<input type="text" value={this.state.configs[1]}
                                          style={{borderColor: this.state.status[1] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 1)}
                                          maxLength={4}/></td>
                            <td style={{display: 'none'}}>$0.<input type="text" value={this.state.configs[3]}
                                          style={{borderColor: this.state.status[3] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 3)}
                                          maxLength={4}/></td>
                            <td>$0.<input type="text" value={this.state.configs[5]}
                                          style={{borderColor: this.state.status[5] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 5)}
                                          maxLength={4}/></td>
                        </tr>
                        <tr>
                            <td>Off-Peak (7pm-7am)</td>
                            <td>$0.<input type="text" value={this.state.configs[0]}
                                          style={{borderColor: this.state.status[0] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 0)}
                                          maxLength={4}/></td>
                            <td style={{display: 'none'}}>$0.<input type="text" value={this.state.configs[2]}
                                          style={{borderColor: this.state.status[2] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 2)}
                                          maxLength={4}/></td>
                            <td>$0.<input type="text" value={this.state.configs[4]}
                                          style={{borderColor: this.state.status[4] ? 'white' : 'red'}}
                                          onChange={this.onInputChanged.bind(this, 4)}
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
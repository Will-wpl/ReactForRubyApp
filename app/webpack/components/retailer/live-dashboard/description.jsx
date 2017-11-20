import React, { Component } from 'react';
import char from '../../../images/char1.png';
import user from '../../../images/user1.png';
export default class Description extends Component {

    render() {
        return (
            <div className="user_form u-grid">
                <div className="col-sm-6 col-md-6">
                    <img src={char} alt="rankinglogo" width="100" />
                </div>
                <div className="col-sm-6 col-md-6">
                    <div className="u-grid user_info">
                        <div className="col-sm-5">
                            <img src={user} alt="userlogo" />
                        </div>
                        <div className="col-sm-7">
                            <h2>{this.props.ranking}</h2>
                            <label>My Ranking</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
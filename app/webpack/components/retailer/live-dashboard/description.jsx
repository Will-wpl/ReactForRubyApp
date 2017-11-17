import React, { Component } from 'react';

export default class Description extends Component {

    render() {
        return (
            <div className="user_form u-grid">
                <div className="col-sm-6 col-md-6">
                    <img src="/assets/char1.png" alt="rankinglogo" width="120" />
                </div>
                <div className="col-sm-6 col-md-6">
                    <div className="u-grid user_info">
                        <div className="col-sm-5">
                            <img src="/assets/user1.png" alt="userlogo" />
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
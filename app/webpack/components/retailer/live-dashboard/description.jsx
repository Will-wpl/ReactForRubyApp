import React, { Component } from 'react';

export default class Description extends Component {

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <img src="" alt="rankinglogo" />
                </div>
                <div className="col-sm-6">
                    <div className="row">
                        <div className="col-sm-3">
                            <img src="" alt="userlogo" />
                        </div>
                        <div className="col-sm-9">
                            <h2>TOP2</h2>
                            <label>My Ranking</label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
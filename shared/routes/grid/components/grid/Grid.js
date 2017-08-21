import React, { Component } from 'react';

import s from './Grid.scss';

export default class Grid extends Component {

  render() {
    return (
      <div className={s.grid}>
        <div className={s.grid__row}>
          <div className={s(s.grid__tenCol, s.grid__offsetLeftOne)}>
            <div className={s.grid__inside} />
          </div>
        </div>

        <div className={s.grid__row}>
          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>

          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>

          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>

          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>

          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>

          <div className={s.grid__twoCol}>
            <div className={s.grid__inside} />
          </div>
        </div>

        <div className={s.grid__row}>
          <div className={s(s.grid__threeCol, s.grid__offsetLeftOne)}>
            <div className={s.grid__inside} />
          </div>

          <div className={s(s.grid__threeCol, s.grid__offsetLeftOne)}>
            <div className={s.grid__inside} />
          </div>

          <div className={s(s.grid__threeCol, s.grid__offsetLeftOne)}>
            <div className={s.grid__inside} />
          </div>
        </div>

        <div className={s.grid__row}>
          <div className={s(s.grid__fourCol, s.grid__offsetLeftOne, s.grid__offsetRightOne)}>
            <div className={s.grid__inside} />
          </div>

          <div className={s(s.grid__fourCol, s.grid__offsetLeftOne, s.grid__offsetRightOne)}>
            <div className={s.grid__inside} />
          </div>
        </div>

        <div className={s.grid__spacer} />
      </div>
    );
  }
}

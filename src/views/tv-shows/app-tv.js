import { LitElement, html, css } from "lit";

//Redux
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../../redux/store";

import * as app from "../../redux/app";
import * as router from "../../redux/router";
import api from "../../redux/api";

//i18next
import i18next from '@dw/i18next-esm';
import { localize } from '@dw/pwa-helpers';

//custom element
import "../components/my-loader";
import "./tv-list-container";
import "@dreamworld/dw-button";
import "@dreamworld/dw-input";

export class AppTV extends connect(store)(localize(i18next)(LitElement)) {

  static styles = [
    css`
      :host{
        display: flex;
        flex: 1;
        margin-top: 28px;
        margin-left: 16px;
      }

      h2{
        margin:0;
        margin-bottom: 8px;
      }

      .main{
        flex: 1;
      }

      .filter{
        display: flex;
        flex: 1 1 0%;
        justify-content: flex-end;
        align-items: center;
        margin-right: 16px;
      }

      #nextBtn {
        float: right;
        margin-right: 16px;
      }
    `
  ]

  static properties = {
    data: {
      type: Object
    },
    pageNumber: {
      type: Number
    },
    queryString: {
      type: String
    }
  }

  constructor() {
    super();
    this.data;
    this.pageNumber = 1;
    this.timer;
    this.waitTime = 1000;
  }

  render() {
    return this._getInitView();
  }

  _getInitView() {
    if (this.data !== undefined) {
      return html`
        <div class="main">
          <div class="filter">
            <dw-input @keyup=${this._onSearch} value=${this.queryString} placeholder="Search"></dw-input>
          </div>
          <h2>Popular TV Shows</h2>
          <tv-list-container .dataSet=${this.data.results}></tv-list-container>
          <dw-button id="nextBtn" @click=${this._onNextClick} icon="navigate_next" trailingIcon raised>Next</dw-button>
        </div>
      `
    }

    return html`<my-loader></my-loader>`;

  }

  _onSearch(e) {

    let text = e.target.value;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      // this.queryString = text;
      this.searchTV(text);
    }, this.waitTime)
  }

  searchTV(str) {
    if (str === "") {
      router.navigatePage("shows", false);
      return;
    }
    router.navigatePage("shows", { query: str }, false);

  }

  _onNextClick(e) {
    let pageNum = this.pageNumber === undefined ? 1 : this.pageNumber;
    if (this.queryString === undefined) {
      router.navigatePage("shows", { page: pageNum + 1 }, false);
      return;
    }
    router.navigatePage("shows", { page: pageNum + 1, query: this.queryString }, false);
    this.pageNumber = pageNum + 1;
  }

  _getPopularTV() {
    if (this.queryString !== undefined) {
      api("/search/tv", this.pageNumber)
        .then(res => this.data = res);
      return;
    }
    api("/tv/popular", this.pageNumber)
      .then(res => this.data = res);

  }

  stateChanged(state) {
    i18next.changeLanguage(app.selectors.getLanguage(state));
    this.pageNumber = router.selectors.currentPageNumber(state);
    this.queryString = router.selectors.currentQueryString(state);
    this._getPopularTV();
  }
}

window.customElements.define("app-tv", AppTV);
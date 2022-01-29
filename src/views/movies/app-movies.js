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
import "./movies-list-container";

export class AppMovies extends connect(store)(localize(i18next)(LitElement)) {

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

    .mdc-text-field__input {
        font-family: Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 1rem;
        line-height: 1.75rem;
        font-weight: 400;
        letter-spacing: 0.009375em;
        text-decoration: inherit;
        text-transform: inherit;
        align-self: flex-end;
        box-sizing: border-box;
        padding: 10px 16px 6px;
        transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
        border: 1px solid;
        border-radius: 1px;
        background: 0px 0px;
        appearance: none;
        caret-color: #6200ee;
    }

    .mdc-button {
        -webkit-font-smoothing: antialiased;
        font-family: var(--mdc-typography-button-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
        font-size:0.875rem;
        font-weight: 500;
        letter-spacing: 0.0892857em;
        text-decoration: none;
        text-transform: uppercase;
        padding: 0px 16px;
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        min-width: 64px;
        border: none;
        outline: none;
        line-height: inherit;
        user-select: none;
        appearance: none;
        overflow: visible;
        vertical-align: middle;
        border-radius: 4px;
        height: 36px;
        background: #6200ee;
        color: white;
    }

    .mdc-button:hover,  .mdc-button:focus-visible,  .mdc-button:focus {
        box-shadow: var(--mdc-button-raised-box-shadow-hover,0 2px 4px -1px rgba(0,0,0,0.2),0 4px 5px 0 rgba(0,0,0,0.14),0 1px 10px 0 rgba(0,0,0,0.12));
        background: #7754a9;
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
            <input class="mdc-text-field__input" @keyup=${this._onSearch} value=${this.queryString} placeholder="Search"></input>
          </div>
          <h2>Popular Movies</h2>
          <movies-list-container .dataSet=${this.data.results}></movies-list-container>
          <button class="mdc-button" id="nextBtn" @click=${this._onNextClick} icon="navigate_next" trailingIcon raised>Next</button>
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
      this.searchMovies(text);
    }, this.waitTime)
  }

  searchMovies(str) {
    if (str === "") {
      router.navigatePage("movies", false);
      return;
    }
    router.navigatePage("movies", { query: str }, false);

  }

  _onNextClick(e) {
    let pageNum = this.pageNumber === undefined ? 1 : this.pageNumber;
    if (this.queryString === undefined) {
      router.navigatePage("movies", { page: pageNum + 1 }, false);
      return;
    }
    router.navigatePage("movies", { page: pageNum + 1, query: this.queryString }, false);
    this.pageNumber = pageNum + 1;
  }

  _getPopularMovies() {
    if (this.queryString !== undefined) {
      api("/search/movie", this.pageNumber)
        .then(res => this.data = res);
      return;
    }
    api("/movie/popular", this.pageNumber)
      .then(res => this.data = res);

  }

  stateChanged(state) {
    i18next.changeLanguage(app.selectors.getLanguage(state));
    this.pageNumber = router.selectors.currentPageNumber(state);
    this.queryString = router.selectors.currentQueryString(state);
    this._getPopularMovies();
  }
}

window.customElements.define("app-movies", AppMovies);
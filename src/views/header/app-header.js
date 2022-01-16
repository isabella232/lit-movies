import { LitElement, html, css } from "lit";

//Redux
import { connect } from "pwa-helpers/connect-mixin.js";
import {store} from "../../redux/store";

//i18next
import i18next from '@dw/i18next-esm';
import { localize } from '@dw/pwa-helpers';

//Dw-Components
import '@dreamworld/dw-switch';
import '@dreamworld/dw-icon-button';

//Custom Components
import { DwSurface } from "../components/dw-surface";
import './profile-popover.js'

//Selectors
import * as app from "../../redux/app";
import * as router from "../../redux/router";

export class AppHeader extends connect(store)(localize(i18next)(DwSurface)){

  static styles = [
    DwSurface.styles,
    css `

      :host{
        display: block;
        position: fixed;
        height: 56px;
        z-index: 5;
      }

      :host([layout='mobile']){
        border-radius: 0px;
      }

      .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
      }

      .header div{
        display: flex;
        align-items: center;
      }

      dw-icon-button{
        width: max-content;
        height: max-content;
      }

      button{
        
      }

      .title{
        flex: 1;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        object-fit: cover;
      } 
    `
  ];

  static properties = {
    page: {
      type: String
    },    
    layout: {
      type: String,
      reflect: true,
    }
  }

  constructor(){
    super();
  }

  get _getContentTemplate(){

    return html`
      <div class="header">
        <div class="title">
          <button id="btn-menu" @click="${this._onDrawerToggel}" name="menu">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
  <path fill="currentColor" d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
          </button>
          <h4>${this._getPageName()}</h4>
        </div>
        ${this._getProfileView()}
      </div>

      <profile-popover id="profile-popover"></profile-popover>
    `
  }

  _getProfileView(){
    // return this.layout !== 'desktop' 
    //   ? html`<img @click="${this._onProfileClick}" src="src/img/page-not-found.png">` 
    //   : html``;

    return html`<img @click="${this._onProfileClick}" src="src/img/not-found/page-not-found.png">`;
  }

  _getPageName(){
    return i18next.t(this.page.toLowerCase());
  }

  _onProfileClick(e){
    let popover = this.renderRoot.querySelector('#profile-popover');
    popover.showTrigger = true;
    popover.open(e.target);
  }

  _onDrawerToggel(e){
    store.dispatch({
      type: 'drawerStatusChange',
      drawerOpened: store.getState().app.drawerOpened ? false : true,
    });
  }

  stateChanged(state){
    this.page = router.selectors.currentModule(state);
    this.layout = app.selectors.getLayout(state);
    this.elevation = app.selectors.getScrollTop(state) ? 0 : 2;
    i18next.changeLanguage(app.selectors.getLanguage(state));
  }
}



window.customElements.define("app-header", AppHeader);
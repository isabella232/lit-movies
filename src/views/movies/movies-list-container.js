import { LitElement, html, css } from "lit";

//Redux
import { connect } from "pwa-helpers/connect-mixin.js";
import { store } from "../../redux/store";

//i18next
import i18next from '@dw/i18next-esm';
import { localize } from '@dw/pwa-helpers';

//custom-components
import "./movies-list-item";

//selectors
import * as app from "../../redux/app";

// import "@lit-labs/virtualizer";

export class ListContainer extends connect(store)(localize(i18next)(LitElement)) {
  static styles = [
    css`
      :host{
        flex: 1;
        display: flex; 
        width: 100%;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        top: 0;
        left: 0;
      }

      :host([layout='mobile']) .main{
        justify-content: center;
      }

      .main{
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }

      .main div{
        margin-right: 16px;
        margin-bottom: 16px;
      }
    `
  ]

  static properties = {
    dataSet: { type: Object },
    layout: {
      type: String,
      reflect: true
    },
    imageUrl: { 
      type: String 
    }
  }

  constructor() {
    super();
    this.dataSet;

  }

  render() {
    console.log(this.dataSet);
    return html`
      <div class="main">

        <!-- <lit-virtualizer
          .scrollTarget=${window}
          .items=${this.dataSet}
          .renderItem=${(row) => {
            let imageUrl = "src/img/not-found/not-available.png";
            if(row.poster_path !== null){
              imageUrl = "".concat(this.imageUrl, "/w300", row.poster_path);
            }
            return html`
              <div>
                ${console.log(row)}
              </div>`
          }}>

        </lit-virtualizer> -->
        
        ${this.dataSet.map((row, index) => {
          const imagesToEagerLoad = 4;
          let imageUrl = "src/img/not-found/not-available.png";
          if(row.poster_path !== null){
            imageUrl = "".concat(this.imageUrl, "/w300", row.poster_path);
          }
          return html`
            <div>
              <movies-list-item .id=${row.id} redirect="movies">

                <img slot="image" src=${imageUrl} width="171" height="256" alt="${row.overview}" loading="${ index <= imagesToEagerLoad ? 'eager': 'lazy'}"/>
                <h2 slot="title1">${row.title}</h2>
                  
              </movies-list-item>
            </div>`
        } )}
      </div>
    `;
  }

  stateChanged(state) {
    i18next.changeLanguage(app.selectors.getLanguage(state));
    this.layout = app.selectors.getLayout(state);
    this.imageUrl = app.selectors.apiImageUrl(state);
  }
}

window.customElements.define("movies-list-container", ListContainer);
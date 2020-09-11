(function () {
  "use strict";

  class GithubProfileWidget extends HTMLElement {
    constructor() {
      super();

      this.shadow = this.attachShadow({ mode: "open" });
      this.shadow.appendChild(template.content.cloneNode(true));
      this.badge = this.shadow.getElementById("badge");
    }

    async getUserData() {
      const userName = this.getAttribute("username");
      const user = await fetch(`https://api.github.com/users/${userName}`);

      return user.json();
    }

    connectedCallback() {
      window.addEventListener(
        "load",
        async () => {
          try {
            this.data = await this.getUserData();

            if (this.data.message) {
              this.badge.innerHTML = `
                <div class="inner">
                  <p>${this.data.message.split("(")[0]}</p>
                  <p>Please try again in a minute.</p>
                </div>
              `;
              return false;
            }

            this.badge.innerHTML = `
              <div class="inner">
                <a href=${this.data.html_url}>
                  <img src=${this.data.avatar_url} />
                </a>
                <h2>${this.data.name}</h2>
                <p>${this.data.bio}</p>
                <p>${this.data.company}</p>        
                <div>
                  <a class="button" href=https://github.com/${this.data.login}?tab=repositories>
                    Public repos: ${this.data.public_repos}
                  </a>
                  <a class="button" href=https://github.com/${this.data.login}?tab=followers>
                    Followers: ${this.data.followers}
                  </a>
                  <a class="button" href=https://github.com/${this.data.login}?tab=following>
                    Following: ${this.data.following}
                  </a>
                </div>
                <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              </div>
            `;
          } catch (e) {
            this.badge.innerHTML = `
              <div class="inner">
                <h3>Github profile failed to load</h3>
                <p>Something went wrong. We are terribly sorry! Please try again later.</p>
              </div>
            `;
          }
        },
        { once: true }
      );
    }
  }

  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      .inner {
        text-align: center;
      }
      
      .button {
        display: inline-block;
        margin: 8px;
        text-decoration: none;
        color: black;
        font-weight: bold;
      }

      .button:hover {
        color: #2ea44f;
      }

      img {
        width: 100px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
      }
    </style>
    <div id="badge"></div>
  `;

  customElements.define("github-profile-widget", GithubProfileWidget);
})();

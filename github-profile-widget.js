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
      const user = this.getAttribute("username");
      const result = await fetch(`https://api.github.com/users/${user}`);

      return result.json();
    }

    connectedCallback() {
      window.addEventListener(
        "load",
        async (event) => {
          this.data = await this.getUserData();
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
          </div>
          `;
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

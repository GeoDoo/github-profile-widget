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
            <h3>${this.data.name}</h3>
            <p>${this.data.bio}</p>
            <p>${this.data.company}</p>          
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

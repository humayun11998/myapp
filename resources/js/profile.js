import DOMPurify from "dompurify";
import axios from "axios"; // Make sure to import axios if not already done.

export default class Profile {
  constructor() {
    this.links = document.querySelectorAll(".profile-nav a");
    this.contentArea = document.querySelector(".profile-slot-content");
    this.events();
  }

  // events
  events() {
    window.addEventListener("popstate", () => {
      this.handleChange();
    });
    this.links.forEach(link => {
      link.addEventListener("click", (e) => this.handleLinkClick(e));
    });
  }

  async handleChange() {
    this.links.forEach(link => link.classList.remove("active"));

    for (const link of this.links) {
      if (link.getAttribute("href") === window.location.pathname) {
        try {
          const response = await axios.get(link.href + "/raw");
          this.contentArea.innerHTML = DOMPurify.sanitize(response.data.theHTML);
          document.title = response.data.docTitle + " | OurApp";
          link.classList.add("active");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  }

  // methods
  async handleLinkClick(e) {
    e.preventDefault();

    const target = e.target.closest('a'); // Ensure we target the anchor element
    if (!target) return;

    this.links.forEach(link => link.classList.remove("active"));
    target.classList.add("active");

    try {
      const response = await axios.get(target.href + "/raw");
      this.contentArea.innerHTML = DOMPurify.sanitize(response.data.theHTML);
      document.title = response.data.docTitle + " | OurApp";

      history.pushState({}, "", target.href);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}

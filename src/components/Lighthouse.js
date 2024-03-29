import React from "react";
import { Button } from "nr1";

export default class Lighthouse extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Button type={Button.TYPE.SECONDARY} to="https://developers.google.com/web/tools/lighthouse">
        <svg width="14px" height="14px" viewBox="0 0 24 24">
          {" "}
          <defs>
            {" "}
            <linearGradient
              x1="57.456%"
              y1="13.086%"
              x2="18.259%"
              y2="72.322%"
              id="lh-topbar__logo--a"
            >
              {" "}
              <stop
                stop-color="#262626"
                stop-opacity=".1"
                offset="0%"
              ></stop>{" "}
              <stop stop-color="#262626" stop-opacity="0" offset="100%"></stop>{" "}
            </linearGradient>{" "}
            <linearGradient
              x1="100%"
              y1="50%"
              x2="0%"
              y2="50%"
              id="lh-topbar__logo--b"
            >
              {" "}
              <stop
                stop-color="#262626"
                stop-opacity=".1"
                offset="0%"
              ></stop>{" "}
              <stop stop-color="#262626" stop-opacity="0" offset="100%"></stop>{" "}
            </linearGradient>{" "}
            <linearGradient
              x1="58.764%"
              y1="65.756%"
              x2="36.939%"
              y2="50.14%"
              id="lh-topbar__logo--c"
            >
              {" "}
              <stop
                stop-color="#262626"
                stop-opacity=".1"
                offset="0%"
              ></stop>{" "}
              <stop stop-color="#262626" stop-opacity="0" offset="100%"></stop>{" "}
            </linearGradient>{" "}
            <linearGradient
              x1="41.635%"
              y1="20.358%"
              x2="72.863%"
              y2="85.424%"
              id="lh-topbar__logo--d"
            >
              {" "}
              <stop stop-color="#FFF" stop-opacity=".1" offset="0%"></stop>{" "}
              <stop stop-color="#FFF" stop-opacity="0" offset="100%"></stop>{" "}
            </linearGradient>{" "}
          </defs>{" "}
          <g fill="none" fill-rule="evenodd">
            {" "}
            <path
              d="M12 3l4.125 2.625v3.75H18v2.25h-1.688l1.5 9.375H6.188l1.5-9.375H6v-2.25h1.875V5.648L12 3zm2.201 9.938L9.54 14.633 9 18.028l5.625-2.062-.424-3.028zM12.005 5.67l-1.88 1.207v2.498h3.75V6.86l-1.87-1.19z"
              fill="#F44B21"
            ></path>{" "}
            <path
              fill="#FFF"
              d="M14.201 12.938L9.54 14.633 9 18.028l5.625-2.062z"
            ></path>{" "}
            <path
              d="M6 18c-2.042 0-3.95-.01-5.813 0l1.5-9.375h4.326L6 18z"
              fill="url(#lh-topbar__logo--a)"
              fill-rule="nonzero"
              transform="translate(6 3)"
            ></path>{" "}
            <path
              fill="#FFF176"
              fill-rule="nonzero"
              d="M13.875 9.375v-2.56l-1.87-1.19-1.88 1.207v2.543z"
            ></path>{" "}
            <path
              fill="url(#lh-topbar__logo--b)"
              fill-rule="nonzero"
              d="M0 6.375h6v2.25H0z"
              transform="translate(6 3)"
            ></path>{" "}
            <path
              fill="url(#lh-topbar__logo--c)"
              fill-rule="nonzero"
              d="M6 6.375H1.875v-3.75L6 0z"
              transform="translate(6 3)"
            ></path>{" "}
            <path
              fill="url(#lh-topbar__logo--d)"
              fill-rule="nonzero"
              d="M6 0l4.125 2.625v3.75H12v2.25h-1.688l1.5 9.375H.188l1.5-9.375H0v-2.25h1.875V2.648z"
              transform="translate(6 3)"
            ></path>{" "}
          </g>{" "}
        </svg>{" "}
        Powered by Lighthouse{" "}
      </Button>
    );
  }
}

import React from "react";
import { NerdletStateContext } from "nr1";
import SeoModal from "./components/SeoModal";

export default class SeoModalNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <SeoModal
            accountId={nerdletState.accountId}
            requestedUrl={nerdletState.requestedUrl}
            strategy={nerdletState.strategy}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

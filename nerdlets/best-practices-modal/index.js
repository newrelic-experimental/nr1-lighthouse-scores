import React from "react";
import { NerdletStateContext } from "nr1";
import BestPracticesModal from "./components/BestPracticesModal";

export default class BestPracticesModalNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <BestPracticesModal
            accountId={nerdletState.accountId}
            requestedUrl={nerdletState.requestedUrl}
            strategy={nerdletState.deviceType}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

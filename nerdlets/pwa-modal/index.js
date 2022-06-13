import React from "react";
import { NerdletStateContext } from "nr1";
import PwaModal from "./components/PwaModal";

export default class PwaModalNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <PwaModal
            accountId={nerdletState.accountId}
            requestedUrl={nerdletState.requestedUrl}
            strategy={nerdletState.deviceType}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

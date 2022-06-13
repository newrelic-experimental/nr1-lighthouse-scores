import React from "react";
import { NerdletStateContext } from "nr1";
import PerformanceModal from "./components/PerformanceModal";

export default class PerformanceModalNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <PerformanceModal
            accountId={nerdletState.accountId}
            requestedUrl={nerdletState.requestedUrl}
            strategy={nerdletState.deviceType}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

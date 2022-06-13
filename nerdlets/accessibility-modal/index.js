import React from "react";
import { NerdletStateContext } from "nr1";
import AccessibilityModal from "./components/AccessibilityModal";

export default class AccessibilityModalNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <AccessibilityModal
            accountId={nerdletState.accountId}
            requestedUrl={nerdletState.requestedUrl}
            strategy={nerdletState.deviceType}
          />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

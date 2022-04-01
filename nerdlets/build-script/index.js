import React from "react";
import { NerdletStateContext } from "nr1";
import BuildScriptModal from "./components/BuildScriptModal";
// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class BuildScriptNerdlet extends React.Component {
  render() {
    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => (
          <BuildScriptModal accountId={nerdletState.accountId} />
        )}
      </NerdletStateContext.Consumer>
    );
  }
}

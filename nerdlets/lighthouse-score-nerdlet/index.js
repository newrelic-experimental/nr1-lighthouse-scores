import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Stack,
  StackItem,
  navigation,
  InlineMessage,
  Button,
  CardSection,
  AccountPicker,
  NerdletStateContext,
  EntityByGuidQuery,
  Spinner,
  List,
  ListItem,
} from "nr1";
import OverviewTable from "./components/OverviewTable";
import Lighthouse from "../../src/components/Lighthouse";
import { LighthouseMain } from "./components/LighthouseMain";
export default class LighthouseScoreNerdlet extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      accountId: null,
    };
  }
  _setAccountId = (evt, value) => {
    this.setState({ accountId: null });

    this.setState({
      accountId: value,
    });
  };
  _openModal = () => {
    const { accountId } = this.state;
    navigation.openStackedNerdlet({
      id: "build-script",
      urlState: {
        accountId,
      },
    });
  };

  render() {
    const { accountId } = this.state;

    return (
      <NerdletStateContext.Consumer>
        {(nerdletState) => {
          const guid = nerdletState.entityGuid;

          if (guid) {
            return (
              <EntityByGuidQuery entityGuid={guid}>
                {({ loading, error, data }) => {
                  if (loading) {
                    return <Spinner />;
                  }

                  if (error) {
                    return "Error!";
                  }

                  const entityAccountId = data.entities[0].accountId;
                  return <LighthouseMain entityAccountId={entityAccountId} />;
                }}
              </EntityByGuidQuery>
            );
          }
          return <LighthouseMain entityAccountId={accountId} />;
        }}
      </NerdletStateContext.Consumer>
    );
  }
}

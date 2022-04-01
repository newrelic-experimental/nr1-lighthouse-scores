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
} from "nr1";
import OverviewTable from "./components/OverviewTable";
import Lighthouse from "../../src/components/Lighthouse";

export default class LighthouseScoreNerdlet extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      accountId: null,
    };
  }
  _setAccountId = (evt, value) => {
    this.setState({ accountId: null });
    console.log(value);
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
      <Card>
        <CardBody>
          <Stack style={{ width: "100%", display: "flex" }}>
            <StackItem>
              <img
                src="https://cdn.worldvectorlogo.com/logos/google-lighthouse.svg"
                width="50px"
              />
            </StackItem>
            <StackItem>
              <HeadingText
                spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                type={HeadingText.TYPE.HEADING_2}
              >
                Lighthouse Scores
              </HeadingText>
            </StackItem>
            <StackItem style={{ padding: "10px" }}>
              <Lighthouse />
            </StackItem>
          </Stack>
          <CardSection />
          <Stack>
            <StackItem>
              <AccountPicker
                spacingType={[AccountPicker.SPACING_TYPE.LARGE]}
                value={accountId}
                onChange={this._setAccountId}
                label="Choose your account"
                required
              />
            </StackItem>
            {accountId && (
              <>
                <StackItem>
                  <StackItem style={{ marginLeft: "10px" }}>
                    <div
                      style={{
                        borderLeft: "6px solid rgb(170 170 170 / 16%)",
                        height: "100px",
                      }}
                    ></div>
                  </StackItem>
                </StackItem>
                <StackItem>
                  <HeadingText spacingType={[HeadingText.SPACING_TYPE.LARGE]}>
                    Build Synthetics Scripts
                  </HeadingText>

                  <Button
                    spacingType={[Button.SPACING_TYPE.LARGE]}
                    type={Button.TYPE.OUTLINE}
                    onClick={this._openModal}
                  >
                    Build script
                  </Button>
                </StackItem>
              </>
            )}
            {/* <StackItem style={{ marginLeft: "50px" }}>
              <div
                style={{
                  borderLeft: "6px solid rgb(170 170 170 / 16%)",
                  height: "100px",
                }}
              ></div>
            </StackItem>
            <StackItem>
              <HeadingText spacingType={[HeadingText.SPACING_TYPE.LARGE]}>
                Custom Visualizations
              </HeadingText>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=b35cfedb-c021-d1b7-d5f1-94f43b89544d"
              >
                Overall Scores Viz
              </Button>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=24289fdd-5a80-d3fb-0bd7-19e9d479423a"
              >
                Accessibility Viz
              </Button>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=529315e2-9e70-84b5-0636-764af80c6c7b"
              >
                Best Practices Viz
              </Button>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=8ce68888-3098-14c4-fc95-77734862e82f"
              >
                Performance Viz
              </Button>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=4a715c30-1d02-6512-130e-99d9a37822b1"
              >
                PWA Viz
              </Button>
              <Button
                spacingType={[Button.SPACING_TYPE.LARGE]}
                to="https://one.newrelic.com/dashboards/visualization-explorer/builder?state=fc2732d4-c53c-fcda-e81c-5b9a2b24c098"
              >
                SEO Viz
              </Button>
            </StackItem> */}
          </Stack>

          <CardSection />

          {accountId && (
            <>
              <InlineMessage label="Average scores since 2 days ago" />
              <OverviewTable accountId={accountId} />
            </>
          )}
        </CardBody>
      </Card>
    );
  }
}

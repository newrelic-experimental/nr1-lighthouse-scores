import React, {useState} from "react";
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
import OverviewTable from "./OverviewTable";
import Lighthouse from "../../../src/components/Lighthouse";

const _openModal = (stateAccountId) => {
  navigation.openStackedNerdlet({
    id: "build-script",
    urlState: {
      stateAccountId,
    },
  });
};

export const LighthouseMain = ({entityAccountId}) => {

  const [stateAccountId, setStateAccountId] = useState(entityAccountId);

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
              value={stateAccountId}
              onChange={(evt, value) => setStateAccountId(value)}
              label="Choose your account"
              required
            />
          </StackItem>
          {stateAccountId && (
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
                <HeadingText
                  spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                >
                  Build Synthetics Scripts
                </HeadingText>

                <Button
                  spacingType={[Button.SPACING_TYPE.LARGE]}
                  type={Button.TYPE.SECONDARY}
                  onClick={() => _openModal(stateAccountId)}
                >
                  Build script
                </Button>
              </StackItem>
            </>
          )}
        </Stack>

        <CardSection />

        {stateAccountId && (
          <>
            <InlineMessage label="Average scores since 2 days ago" />
            <OverviewTable accountId={stateAccountId} />
          </>
        )}
      </CardBody>
    </Card>
  );
}
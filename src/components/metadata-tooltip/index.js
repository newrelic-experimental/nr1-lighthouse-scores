import React from "react";
import { PropTypes } from "prop-types";
import {
  Badge,
  Stack,
  StackItem,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverBody,
  BlockText,
  Table,
  TableRow,
  TableRowCell,
} from "nr1";
const MetadataTooltip = ({
  locale,
  userAgent,
  lighthouseVersion,
  totalTiming,
}) => {
  const items = [
    { name: "locale", value: locale },
    { name: "userAgent", value: userAgent },
    { name: "lighthouseVersion", value: lighthouseVersion },
    { name: "totalTiming", value: totalTiming },
  ];
  return (
    <>
      <Popover>
        <PopoverTrigger>
          {/* <Button> */}
          <Icon
            style={{ cursor: "pointer" }}
            spacingType={[Icon.SPACING_TYPE.MEDIUM]}
            type={Icon.TYPE.INTERFACE__SIGN__EXCLAMATION__V_ALTERNATE}
          />
          {/* </Button> */}
        </PopoverTrigger>
        <PopoverBody>
          <Stack directionType={Stack.DIRECTION_TYPE.VERTICAL}>
            <StackItem>
              <Stack>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px", width: "130px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    <strong>Lighthouse version</strong>
                  </BlockText>
                </StackItem>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    {lighthouseVersion}
                  </BlockText>
                </StackItem>
              </Stack>
            </StackItem>
            <StackItem>
              <Stack>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px", width: "130px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    <strong>User agent</strong>
                  </BlockText>
                </StackItem>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    {userAgent}
                  </BlockText>
                </StackItem>
              </Stack>
            </StackItem>
            <StackItem>
              <Stack>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px", width: "130px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    <strong>Locale</strong>
                  </BlockText>
                </StackItem>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    {locale}
                  </BlockText>
                </StackItem>
              </Stack>
            </StackItem>
            <StackItem>
              <Stack>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px", width: "130px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    <strong>Total timing</strong>
                  </BlockText>
                </StackItem>
                <StackItem>
                  <BlockText
                    style={{ padding: "20px" }}
                    type={BlockText.TYPE.PARAGRAPH}
                  >
                    {`${totalTiming / 1000} seconds`}
                  </BlockText>
                </StackItem>
              </Stack>
            </StackItem>
          </Stack>
        </PopoverBody>
      </Popover>
    </>
  );
};

MetadataTooltip.propTypes = {
  locale: PropTypes.string,
  userAgent: PropTypes.string,
  lighthouseVersion: PropTypes.string,
  totalTiming: PropTypes.string,
};

export default MetadataTooltip;

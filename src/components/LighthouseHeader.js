import React from "react";
import { PropTypes } from "prop-types";
import { HeadingText, Stack, StackItem, Icon, Link, NrqlQuery, Tooltip, Spinner } from "nr1";
import MetadataTooltip from "./metadata-tooltip";
import NoDataState from "../../src/no-data-state";
import ErrorState from "../../src/error-state";

const LighthouseHeader = ({ title, requestedUrl, strategy, query, accountId }) => {
  return (
    <>
      <HeadingText
        type={HeadingText.TYPE.HEADING_2}
        spacingType={[HeadingText.SPACING_TYPE.LARGE]}
      >
        {title}
      </HeadingText>
      <Stack>
        <StackItem>
          <Link
            spacingType={[HeadingText.SPACING_TYPE.LARGE]}
            to={requestedUrl}
            style={{fontSize: "1.8em"}}
          >
            {requestedUrl}
          </Link>
        </StackItem>
        <StackItem>
          {strategy === "mobile" ? (
            <Tooltip text="Device: Mobile">
              <Icon style={{fontSize: "1.8em"}} spacingType={[Icon.SPACING_TYPE.MEDIUM]} type={Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__MOBILE} />
            </Tooltip>
          ) : (
            <Tooltip text="Device: Desktop">
              <Icon style={{fontSize: "1.8em"}} spacingType={[Icon.SPACING_TYPE.MEDIUM]} type={Icon.TYPE.HARDWARE_AND_SOFTWARE__HARDWARE__DESKTOP} />
            </Tooltip>
          )}
        </StackItem>
        <StackItem>
          <NrqlQuery
            query={query}
            accountId={accountId}
            pollInterval={NrqlQuery.AUTO_POLL_INTERVAL}
          >
            {({ data, loading, error }) => {
              if (loading) {
                return <Spinner />;
              }

              if (error) {
                return <ErrorState error={error} />;
              }

              if (!data.length) {
                return <NoDataState />;
              }
              const resultData = data[0].data[0];
              // console.log({ auditRefObject, opportunities });
              const { locale, userAgent, lighthouseVersion, totalTiming } =
                resultData;
              console.log({locale, userAgent, lighthouseVersion, totalTiming})
              return (
                <MetadataTooltip
                  locale={locale}
                  userAgent={userAgent}
                  lighthouseVersion={lighthouseVersion}
                  totalTiming={totalTiming}
                />
              );
            }}
          </NrqlQuery>
        </StackItem>
      </Stack>
    </>
  );
};

LighthouseHeader.propTypes = {
  strategy: PropTypes.string,
  requestedUrl: PropTypes.string,
  title: PropTypes.string,
  query: PropTypes.string,
  accountId: PropTypes.string,
};

export default LighthouseHeader;

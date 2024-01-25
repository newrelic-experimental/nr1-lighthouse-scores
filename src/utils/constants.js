export const createMonitorJson = {
  type: "SCRIPT_API",
  status: "ENABLED",
};

export const syntheticsEndpoint =
  "https://synthetics.newrelic.com/synthetics/api";

export const legacyScoreScript = `


// Do not modify code below this line!!!!
const request = require("request");
const MAX_LENGTH = 4000;

var headers = {
  "Content-Type": "json/application",
  "Api-Key": NR_LICENSE_KEY,
};
const chunkString = (str, length) => {
  return str.match(new RegExp(".{1," + length + "}", "g"));
};

const formatEventName = (name) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const createEvent = (object, refs, audits) => {
  const eventType = \`lighthouse\${formatEventName(object.id)}\`;
  const newEventObject = { eventType, ...object };
  delete newEventObject.auditRefs;
  const auditRefs = refs.map((ref) => {
    const audit = audits.find((audit) => audit.id === ref.id);
    return { ...audit, weight: ref.weight, group: ref.group };
  });

  const stringifiedRefs = JSON.stringify(auditRefs);
  if (stringifiedRefs.length > MAX_LENGTH) {
    const splitData = chunkString(stringifiedRefs, MAX_LENGTH);
    splitData.forEach((data, index) => {
      newEventObject[\`auditRefs_\${index}\`] = data;
    });
  } else {
    newEventObject[\`auditRefs\`] = stringifiedRefs;
  }
  return newEventObject;
};

categories.forEach((cat) => {
  const settings = {
    url,
    category: cat,
    strategy,
  };
  const options = {
    method: "GET",
    url: \`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?key=\${PAGE_SPEED_KEY}\`,
    headers: null,
    qs: settings,
    json: true,
  };
  $http(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (response.statusCode == 200) {
        const {
          lighthouseResult: {
            categories: lightouseCategories,
            audits,
            timing: { total: totalTiming },
            userAgent,
            stackPacks,
            lighthouseVersion,
            requestedUrl,
            runWarnings,
            configSettings: { locale },
            categoryGroups,
            i18n,
            finalUrl,
          },
        } = body;

        var lighthouseMetrics = audits.metrics
          ? audits.metrics.details.items[0]
          : {};
        let coreAttributes;

        for (var attributeName in lighthouseMetrics) {
          if (
            lighthouseMetrics.hasOwnProperty(attributeName) &&
            !attributeName.includes("Ts")
          ) {
            coreAttributes = {
              ...coreAttributes,
              [attributeName]: lighthouseMetrics[attributeName],
            };
          }
        }

        const chosenCategoryAudits = Object.keys(audits).map((key) => {
          return audits[key];
        });
        const chosenCategoryAuditCategories = Object.keys(
          lightouseCategories
        ).map((key) => lightouseCategories[key]);
        const chosenCategoryObject = chosenCategoryAuditCategories.find(
          (category) => category.id === cat
        );
        const chosenCategoryRefs = chosenCategoryObject.auditRefs;

        coreAttributes = {
          ...coreAttributes,
          ...createEvent(
            chosenCategoryObject,
            chosenCategoryRefs,
            chosenCategoryAudits
          ),
        };

        request.post({
          url: EVENT_URL,
          headers: headers,
          body: JSON.stringify({
            ...coreAttributes,
            deviceType: settings.strategy,
            userAgent,
            stackPacks,
            lighthouseVersion,
            requestedUrl: url,
            runWarnings: JSON.stringify(runWarnings),
            locale,
            categoryGroups,
            i18n,
            finalUrl,
            totalTiming,
          }),
        });
      } else {
        console.log("Non-200 HTTP response: " + response.statusCode);
      }
    } else {
      console.log("Response code: " + response.statusCode);
      console.log(error);
    }
  });
});`;

export const scoreScript = `


// Do not modify code below this line!!!!
var assert = require('assert');
const MAX_LENGTH = 4000;

var headers = {
  "Content-Type": "json/application",
  "Api-Key": NR_LICENSE_KEY,
};
const chunkString = (str, length) => {
  return str.match(new RegExp(".{1," + length + "}", "g"));
};

const formatEventName = (name) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

const createEvent = (object, refs, audits) => {
  const eventType = \`lighthouse\${formatEventName(object.id)}\`;
  const newEventObject = { eventType, ...object };
  delete newEventObject.auditRefs;
  const auditRefs = refs.map((ref) => {
    const audit = audits.find((audit) => audit.id === ref.id);
    return { ...audit, weight: ref.weight, group: ref.group };
  });

  const stringifiedRefs = JSON.stringify(auditRefs);
  if (stringifiedRefs.length > MAX_LENGTH) {
    const splitData = chunkString(stringifiedRefs, MAX_LENGTH);
    splitData.forEach((data, index) => {
      newEventObject[\`auditRefs_\${index}\`] = data;
    });
  } else {
    newEventObject[\`auditRefs\`] = stringifiedRefs;
  }
  return newEventObject;
};

categories.forEach((cat) => {
  console.log("Step1: ", cat)
  const settings = {
    key: PAGE_SPEED_KEY,
    url,
    category: cat,
    strategy,
  };
  const options = {
    method: "GET",
    url: \`https://www.googleapis.com/pagespeedonline/v5/runPagespeed\`,
    searchParams: settings,
  };
  $http(options, (error, response, body) => {
    console.log(response.statusCode)
    assert.ok(response.statusCode == 200, 'Expected 200 OK response')
    const {
      lighthouseResult: {
        categories: lightouseCategories,
        audits,
        timing: { total: totalTiming },
        userAgent,
        stackPacks,
        lighthouseVersion,
        requestedUrl,
        runWarnings,
        configSettings: { locale },
        categoryGroups,
        i18n,
        finalUrl,
      },
    } = body;

    var lighthouseMetrics = audits.metrics
      ? audits.metrics.details.items[0]
      : {};
    let coreAttributes = {};

    for (var attributeName in lighthouseMetrics) {
      if (
        lighthouseMetrics.hasOwnProperty(attributeName) &&
        !attributeName.includes("Ts")
      ) {
        coreAttributes = {
          ...coreAttributes,
          [attributeName]: lighthouseMetrics[attributeName],
        };
      }
    }

    const chosenCategoryAudits = Object.keys(audits).map((key) => {
      return audits[key];
    });
    const chosenCategoryAuditCategories = Object.keys(
      lightouseCategories
    ).map((key) => lightouseCategories[key]);
    const chosenCategoryObject = chosenCategoryAuditCategories.find(
      (category) => category.id === cat
    );
    const chosenCategoryRefs = chosenCategoryObject.auditRefs;

    coreAttributes = {
      ...coreAttributes,
      ...createEvent(
        chosenCategoryObject,
        chosenCategoryRefs,
        chosenCategoryAudits
      ),
    };

    $http.post({
      
      url: EVENT_URL,
      headers: headers,
      body: JSON.stringify({
        ...coreAttributes,
        deviceType: settings.strategy,
        userAgent,
        stackPacks,
        lighthouseVersion,
        requestedUrl: url,
        runWarnings: JSON.stringify(runWarnings),
        locale,
        categoryGroups,
        i18n,
        finalUrl,
        totalTiming,
      }),
    }, (error, response, body) => {
      console.log(response.statusCode)
      assert.ok(response.statusCode == 200, 'Expected 200 OK response')
    });
    assert.ok(response.statusCode == 200, 'Expected 200 OK response')
  });
});`
import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  TextField,
  AccountPicker,
  Select,
  SelectItem,
  BlockText,
  Button,
  Modal,
  Form,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
} from "nr1";
import { createMonitorJson, syntheticsEndpoint } from "../utils/constants";
export default class CreateScriptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      freqValue: "15",
      strategy: "desktop",
      selectedAudits: ["score", "perf", "access", "best", "pwa", "seo"],
      selectedLocation: "AWS_US_WEST_2",
      url: "",
      monitorName: "Lighthouse(Score) - https://www.example.com (Desktop)",
      accountId: "",
      userApiKey: "",
      pageSpeedApiKey: "",
      isValid: true,
      urlStatus: 0,
    };
  }
  _onSelectAudits = (evt, value) => {
    console.log(value);
    this.setState({ selectedAudits: value });
  };
  _onSelectStrategy = (evt, value) => {
    const { url } = this.state;
    console.log({ value });
    this.setState({
      strategy: value,
      monitorName: `LighthouseScores - ${url} (${value})`,
    });
  };

  _changeFreq = (evt, value) => {
    console.log({ value });
    this.setState({ freqValue: value });
  };
  _setUrl = (evt) => {
    console.log(evt.target.value);
    const { value } = evt.target;
    const { strategy } = this.state;
    this.setState({
      url: value,
      monitorName: `Lighthouse(Score) - ${value} (${strategy})`,
    });
  };
  _onSelectLocation = (evt, value) => {
    console.log({ evt, value });
    this.setState({ selectedLocation: value });
  };
  _setMonitorName = (evt) => {
    console.log(evt.target.value);
    const { value } = evt.target;
    this.setState({
      monitorName: value,
    });
  };
  _setAccountId = (evt, value) => {
    console.log(value);
    this.setState({
      accountId: value,
    });
  };
  _setPageSpeedApiKey = (evt) => {
    console.log(evt.target.value);
    const { value } = evt.target;
    this.setState({
      pageSpeedApiKey: value,
    });
  };
  _setUserApiKey = (evt) => {
    console.log(evt.target.value);
    const { value } = evt.target;
    this.setState({
      userApiKey: value,
    });
  };

  _onSubmit = async () => {
    const {
      selectedLocation,
      url,
      monitorName,
      accountId,
      userApiKey,
      pageSpeedApiKey,
      freqValue,
    } = this.state;
    const isValid =
      Object.values({
        selectedLocation,
        url,
        monitorName,
        accountId,
        userApiKey,
        pageSpeedApiKey,
      }).filter((v) => v.length === 0).length === 0;
    console.log({ isValid, url });
    try {
      if (url) {
        const res = await fetch(url, {
          method: "GET",
        });
        this.setState({ urlStatus: res.status });
        console.log({ res });
        res.status >= 400 && this.setState({ isValid: false });
      } else {
        this.setState({ isValid: false });
      }
    } catch (e) {
      this.setState({ isValid: false, urlStatus: e.message });
    }

    if (!isValid) {
      console.log("invalid");
      return this.setState({ isValid });
    }
    const createNewMonitor = {
      ...createMonitorJson,
      name: monitorName,
      frequency: freqValue,
      uri: url,
      locations: [selectedLocation],
    };
    console.log(createNewMonitor);
    const corsUrl = "https://ru-cors-proxy.herokuapp.com/";
    await fetch(corsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": userApiKey,
        "Target-Endpoint": `${syntheticsEndpoint}/v3/monitors`
      },
      body: JSON.stringify(createNewMonitor),
    });
  };
  render() {
    const { hidden, _onClose } = this.props;
    const {
      freqValue,
      strategy,
      selectedAudits,
      selectedLocation,
      url,
      monitorName,
      accountId,
      userApiKey,
      pageSpeedApiKey,
      isValid,
      urlStatus,
    } = this.state;
    return (
      <Modal hidden={hidden} onClose={_onClose}>
        <HeadingText type={HeadingText.TYPE.HEADING_3}>Modal</HeadingText>
        <BlockText
          spacingType={[
            BlockText.SPACING_TYPE.EXTRA_LARGE,
            BlockText.SPACING_TYPE.OMIT,
          ]}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictumst
          quisque sagittis purus sit amet.
        </BlockText>
        <Form>
          <TextField
            placeholder="https://www.example.com"
            value={url}
            onChange={this._setUrl}
            label="URL"
            style={{ width: "100%" }}
            invalid={
              (!isValid && !url) ||
              urlStatus >= 400 ||
              typeof urlStatus !== "number"
                ? "Please enter a valid URL"
                : ""
            }
            description={urlStatus && `Status: ${urlStatus}`}
            required
            autoFocus
          />
          <Select
            description="Description value"
            label="Select strategy"
            info="Info value"
            value={strategy}
            onChange={this._onSelectStrategy}
          >
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </Select>
          <CheckboxGroup
            label="Select Audits"
            value={selectedAudits}
            onChange={this._onSelectAudits}
            required
          >
            <Checkbox disabled label="Overall Score" value="score" />
            <Checkbox label="Performance" value="perf" />
            <Checkbox label="Accessibility" value="access" />
            <Checkbox label="Best Practices" value="best" />
            <Checkbox label="PWA" value="pwa" />
            <Checkbox label="SEO" value="seo" />
          </CheckboxGroup>
          <AccountPicker
            value={accountId}
            onChange={this._setAccountId}
            label="Account"
            invalid={!isValid && !accountId ? "Please select an account" : ""}
            required
          />
          <TextField
            value={monitorName}
            label="Monitor Name"
            invalid={!isValid && !monitorName && "Please enter a monitor name"}
            style={{ width: "100%" }}
            onChange={this._setMonitorName}
            required
          />
          <TextField
            label="User API Key"
            value={userApiKey}
            type={TextField.TYPE.PASSWORD}
            invalid={!isValid && !userApiKey && "Please enter a user API key"}
            style={{ width: "100%" }}
            onChange={this._setUserApiKey}
            required
          />
          <TextField
            label="PageSpeed API Key"
            value={pageSpeedApiKey}
            type={TextField.TYPE.PASSWORD}
            invalid={
              !isValid && !pageSpeedApiKey && "Please enter a PageSpeed API key"
            }
            style={{ width: "100%" }}
            onChange={this._setPageSpeedApiKey}
            required
          />
          <RadioGroup
            label="Select location"
            value={selectedLocation}
            onChange={this._onSelectLocation}
          >
            <Radio label="Portland, OR, USA" value="AWS_US_WEST_2" />
            <Radio label="Washington, DC, USA" value="AWS_US_EAST_1" />
            <Radio label="Hong Kong, HK" value="AWS_AP_EAST_1" />
            <Radio label="London, England, UK" value="AWS_EU_WEST_2" />
          </RadioGroup>
          <HeadingText>Frequency</HeadingText>
          <Select value={freqValue} onChange={this._changeFreq}>
            <SelectItem value="1">1 mins</SelectItem>
            <SelectItem value="5">5 mins</SelectItem>
            <SelectItem value="10">10 mins</SelectItem>
            <SelectItem value="15">15 mins</SelectItem>
            <SelectItem value="30">30 mins</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="360">6 hours</SelectItem>
            <SelectItem value="720">12 hours</SelectItem>
            <SelectItem value="1440">1 day</SelectItem>
          </Select>
          <Button
            type={Button.TYPE.PRIMARY}
            sizeType={Button.SIZE_TYPE.SMALL}
            spacingType={[
              HeadingText.SPACING_TYPE.EXTRA_LARGE,
              HeadingText.SPACING_TYPE.NONE,
            ]}
            onClick={this._onSubmit}
          >
            Create dashboard
          </Button>
        </Form>
        <Button onClick={_onClose}>Close</Button>
      </Modal>
    );
  }
}

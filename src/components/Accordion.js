import React from "react";
import {
  Card,
  CardBody,
  HeadingText,
  Grid,
  GridItem,
  NrqlQuery,
  Spinner,
  AutoSizer,
  Tile,
} from "nr1";
import { getSymbol, checkMeasurement, getMainColor } from "../../utils/helpers";
import DisplayValue from "./DisplayValue";
import ReactMarkdown from "react-markdown";
import "./accordion.css";

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accordionIsOpen: false,
      display: "none",
    };
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  toggleAccordion = (e) => {
    if (this.state.accordionIsOpen) {
      this.setState({ accordionIsOpen: false, display: "none" });
    } else {
      this.setState({ accordionIsOpen: true, display: "block" });
    }
  };

  render() {
    const {
      score,
      title,
      description,
      children,
      numericValue,
      numericUnit,
      displayValue,
      explanation,
    } = this.props;

    const color = score !== null ? getMainColor(score * 100) : "grey";
    const code = /`(.*?)`/g;
    const formatTitle = title.replaceAll('<', '&lt;').replaceAll('>', '&gt;').replace(
      code,
      `<span style="color: blue;">$1</span>`
    );
    return (
      <div className="accordion__section">
        <div
          className="accordion__header"
          onClick={(e) => this.toggleAccordion(e)}
        >
          <Tile onClick={console.log}>
            <Grid>
              <GridItem columnSpan={10}>
                <HeadingText>
                  {getSymbol(score)}{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatTitle,
                    }}
                  />{" "}
                  <DisplayValue color={color} displayValue={displayValue} explanation={explanation} />
                </HeadingText>
              </GridItem>
              <GridItem columnSpan={2}>
                <HeadingText>
                  {checkMeasurement(numericUnit, numericValue)}
                </HeadingText>
              </GridItem>
            </Grid>
          </Tile>
        </div>
        <div
          className="accordion__content"
          style={{ display: `${this.state.display}` }}
        >
          <Card>
            <CardBody>
              <HeadingText
                spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                type={HeadingText.TYPE.HEADING_4}
              >
                <ReactMarkdown children={description} />
              </HeadingText>
              {children}
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

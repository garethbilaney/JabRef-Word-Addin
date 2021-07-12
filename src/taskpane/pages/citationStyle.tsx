import * as React from "react";
import { FocusZone, FocusZoneDirection } from "@fluentui/react/lib/FocusZone";
import { List } from "@fluentui/react/lib/List";
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from "@fluentui/react/lib/Styling";
/* global Office */

const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;
const classNames = mergeStyleSets({
  container: {
    overflow: "auto",
    padding: "0.25rem 0.25rem 0px",
    webkitBoxFlex: "1 1 auto",
  },
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 34,
      boxSizing: "border-box",
      padding: "0 25px",
      display: "flex",
      selectors: {
        "&:hover": { background: palette.themeLighterAlt },
      },
    },
  ],
  itemName: [
    fonts.medium,
    {
      padding: "8px 0",
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      minWidth: "100%",
    },
  ],
  StyleHeading: [
    fonts.medium,
    {
      color: palette.neutralSecondary,
      fontWeight: "bold",
      padding: 20,
      paddingBottom: 5,
      paddingTop: 15,
    },
  ],
  selectedStyle: [
    fonts.medium,
    {
      color: palette.themeDarkAlt,
      padding: 20,
      paddingBottom: 5,
      paddingTop: 5,
      fontWeight: "bold",
    },
  ],
});

function CitationStyle() {
  const items = [
    { text: "American Political Science Association", value: "american-political-science-association" },
    { text: "IEEE", value: "ieee" },
    { text: "American Sociological Association 6th edition", value: "american-sociological-association" },
    { text: "American Psychological Association 7th edition", value: "advances-in-complex-systems" },
    { text: "Chicago Manual of Style 16th edition (author-date)", value: "chicago-author-date-16th-edition" },
  ];

  const preferenceStyle = Office.context.document.settings.get("Style");
  const selectedStyle = preferenceStyle
    ? items.find((item) => item.value === preferenceStyle).text
    : "American Sociological Association 6th edition";
  const [currentStyle, setCurrentStyle] = React.useState(selectedStyle);
  const onClick = (ev: React.FormEvent<HTMLElement | HTMLInputElement>) => {
    const id = ev.currentTarget.id;
    if (id) {
      Office.context.document.settings.set("Style", id);
      setCurrentStyle(() => items.find((i) => i.value === id).text);
    }
  };

  // Sync with doc settings
  React.useEffect(() => {
    return Office.context.document.settings.saveAsync();
  });

  const onRenderCell = (item): JSX.Element => {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        <div id={item.value} className={classNames.itemName} onClick={onClick}>
          {item.text}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={classNames.StyleHeading}>Current Style</div>
      <div className={classNames.selectedStyle}>{currentStyle}</div>
      <div className={classNames.StyleHeading}>Change Style</div>
      <div className={classNames.container}>
        <FocusZone direction={FocusZoneDirection.vertical} data-is-scrollable>
          <List items={items} onRenderCell={onRenderCell} />
        </FocusZone>
      </div>
    </>
  );
}

export default CitationStyle;

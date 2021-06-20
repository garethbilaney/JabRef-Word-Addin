import { IStyleSet, ILabelStyles, IPivotStyles, DefaultPalette, Pivot, PivotItem, Label } from "@fluentui/react";
import React from "react";
import Dashboard from "../pages/dashboard";
import Wrapper from "./Wrapper";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: {},
};
const pivotStyle: Partial<IPivotStyles> = {
  root: {
    backgroundColor: DefaultPalette.white,
    marginBottom: 0,
    borderBottom: "1px solid rgba(29, 4, 4, 0.11)",
  },
};

function Layout() {
  return (
    <Wrapper>
      <Pivot aria-label="NAV" styles={pivotStyle} linkSize="normal">
        <PivotItem
          headerText="Library"
          headerButtonProps={{
            "data-order": 1,
            "data-title": "Library title",
          }}
        >
          <Label styles={labelStyles}>
            <Dashboard />
          </Label>
        </PivotItem>
        <PivotItem headerText="Citation Style">
          <Label styles={labelStyles}>
            <div>Under Construction</div>
          </Label>
        </PivotItem>
        <PivotItem headerText="Log out">
          <Label styles={labelStyles}>
            <div>Under Construction</div>
          </Label>
        </PivotItem>
      </Pivot>
    </Wrapper>
  );
}

export default Layout;
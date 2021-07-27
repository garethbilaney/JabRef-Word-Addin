import React, { ReactElement, useState } from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import data from "../../utils/data";
import ReferenceList, { bib } from "../components/ReferenceList";
import SearchField from "../components/SearchField";
import CiteSupport from "../../utils/citesupport";

interface dashboardProps {
  citeSupport: CiteSupport;
}

const dashboadStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  overflow: "hidden",
  flexDirection: "column" as const,
};

const buttonContainer = {
  display: "flex",
  flexDirection: "row" as const,
  marginTop: "auto",
  flex: "0 0 auto",
  width: "100%",
  alignContent: "flex-start",
  padding: 16,
};

function containsSearchTerm(keyword: string) {
  return (item?: bib) => {
    return [item.title, item.author, item.year].some((str: string | number) =>
      str
        ? str.toString().toLowerCase().includes(keyword.toLowerCase().trim())
        : false
    );
  };
}

function onCheckboxChange(ev: React.FormEvent<HTMLElement | HTMLInputElement>) {
  return (item: bib) => {
    if (ev.currentTarget && item.title === ev.currentTarget.title) {
      return { ...item, isSelected: !item.isSelected };
    }
    return item;
  };
}

function unCheckCheckbox(item: bib): bib {
  return { ...item, isSelected: false };
}

function Dashboard({ citeSupport }: dashboardProps): ReactElement {
  const originalItems = data.map((item) => ({ ...item, isSelected: false }));
  const [items, setItems] = useState(originalItems);
  const checkedItems = items
    .filter((item) => item.isSelected)
    .map((item) => {
      return { id: item.id };
    });

  const onFilterChange = (_: any, keyword: string): void => {
    setItems(originalItems.filter(containsSearchTerm(keyword)));
  };

  const handleToggleChange = (
    ev: React.FormEvent<HTMLElement | HTMLInputElement>
  ) => {
    setItems((currentItems) => {
      return currentItems.map(onCheckboxChange(ev));
    });
  };

  const unCheckAllCheckbox = () => {
    setItems((currenItems) => {
      return currenItems.map(unCheckCheckbox);
    });
  };

  async function insertCitation() {
    const isCitation = citeSupport.isCitation();
    await citeSupport.updateCitationByIndex();
    let citation = null;
    if (!isCitation) {
      if (checkedItems.length) {
        citeSupport.api.insertEmptyContentControl();
        citation = {
          citationItems: checkedItems,
          properties: {
            noteIndex: 0,
          },
        };
      }
    }
    let citationsPre = [];
    let citationsPost = [];
    const i = await citeSupport.api.getPositionOfNewCitation();
    if (citeSupport.config.citationByIndex.slice(0, i).length) {
      citationsPre = citeSupport.config.citationByIndex
        .slice(0, i)
        .map(function (obj) {
          return [obj.citationID, 0];
        });
    }
    if (citeSupport.config.citationByIndex.slice(i).length) {
      citationsPost = citeSupport.config.citationByIndex
        .slice(i)
        .map(function (obj) {
          return [obj.citationID, 0];
        });
    }
    citeSupport.callRegisterCitation(citation, citationsPre, citationsPost);
    unCheckAllCheckbox();
  }

  return (
    <div style={dashboadStyle}>
      <SearchField onFilterChange={onFilterChange} />
      <ReferenceList list={items} onCheckBoxChange={handleToggleChange} />
      {checkedItems.length ? (
        <div style={buttonContainer}>
          <PrimaryButton onClick={insertCitation}>
            Insert {checkedItems.length} citation
          </PrimaryButton>
          <DefaultButton onClick={unCheckAllCheckbox} style={{ marginLeft: 8 }}>
            cancel
          </DefaultButton>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;

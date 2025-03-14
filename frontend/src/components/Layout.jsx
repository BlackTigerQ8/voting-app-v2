import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

// Reusable card component
const Card = ({ className = "", children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div
      className={`flex items-center justify-center rounded-lg shadow-sm ${className}`}
      style={{
        backgroundColor: colors.black[500],
        border: `1px solid ${colors.grey[500]}`,
      }}
    >
      {children}
    </div>
  );
};

// Grid section component
const GridSection = ({ cols, className = "", children }) => {
  // Define grid columns classes mapping
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

const Layout = ({ sections }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const renderSection = (section, index) => {
    if (section.type === "grid") {
      return (
        <GridSection
          key={index}
          cols={section.cols}
          className={section.className}
        >
          {section.cards.map((card, cardIndex) => (
            <Card key={cardIndex} className={card.height}>
              {card.component}
            </Card>
          ))}
        </GridSection>
      );
    }

    return (
      <Card key={index} className={`${section.height} ${section.className}`}>
        {section.component}
      </Card>
    );
  };

  return (
    <div className="p-4">
      <div className="p-4 space-y-4">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );
};

export default Layout;

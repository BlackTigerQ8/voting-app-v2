import React from "react";
import { Backdrop as MuiBackdrop } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { helix } from "ldrs";

helix.register();

const Backdrop = ({ isOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MuiBackdrop
      open={isOpen}
      sx={{
        color: colors.yellow[500],
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: `${colors.black[500]}CC`,
      }}
    >
      <div
        className="p-8 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: colors.black[400],
          border: `1px solid ${colors.grey[500]}`,
        }}
      >
        <l-helix size="45" speed="2.5" color={colors.yellow[500]}></l-helix>
      </div>
    </MuiBackdrop>
  );
};

export default Backdrop;

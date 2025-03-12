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
        color: colors.accent.default,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <div
        className="p-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: colors.primary.light }}
      >
        <l-helix size="45" speed="2.5" color={colors.accent.default}></l-helix>
      </div>
    </MuiBackdrop>
  );
};

export default Backdrop;

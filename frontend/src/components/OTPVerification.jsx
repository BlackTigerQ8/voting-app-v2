import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { cleanupTempUser, verifyOTPAndRegister } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTPVerification = ({ open, tempUserId, onClose }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(
        verifyOTPAndRegister({
          tempUserId,
          otp,
        })
      ).unwrap();

      if (result.status === "Success") {
        toast.success("Registration successful!");
        onClose();
        navigate("/login");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error(error.message || "Invalid verification code");
      // Clean up temp user data on verification failure
      await dispatch(cleanupTempUser(tempUserId));
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Email Verification</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please enter the verification code sent to your email address.
        </Typography>
        <TextField
          fullWidth
          label="Enter OTP"
          value={otp}
          onChange={(e) => {
            // Only allow numbers
            const value = e.target.value.replace(/[^0-9]/g, "");
            setOtp(value);
          }}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          sx={{ mb: 2 }}
          autoFocus
          placeholder="Enter 6-digit code"
          inputProps={{
            maxLength: 6,
            pattern: "[0-9]*",
          }}
          error={otp.length > 0 && otp.length !== 6}
          helperText={
            otp.length > 0 && otp.length !== 6
              ? "Please enter a 6-digit code"
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          color="primary"
          disabled={isLoading || otp.length !== 6}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTPVerification;

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../RaiseSupportAdmin.scss";
import axios from "axios";
import ENDPOINTS from "constants/endpoints";
import getUserToken from "helpers/getUserToken";
import agent from "admin/api/agent";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  p: 4,
};

const ResolveModal = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = () => setOpen(false);
  const closeAndReload = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleYes = async () => {
    setIsLoading(true);
    const body = { status: "RESOLVED" };
    await agent.RaiseSupport.resolveTicket(id, body);
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {isSuccess ? (
            <>
              <Typography
                sx={{ textAlign: "center" }}
                id="modal-modal-title"
                variant="h4"
              >
                Ticket is now resolved!
              </Typography>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  className="confirmation-btn-success"
                  onClick={closeAndReload}
                >
                  CLOSE
                </button>
              </div>
            </>
          ) : (
            <>
              {isLoading ? (
                <Typography
                  sx={{ textAlign: "center" }}
                  id="modal-modal-title"
                  variant="h4"
                >
                  Loading... Please wait..
                </Typography>
              ) : (
                <>
                  <Typography
                    sx={{ textAlign: "center" }}
                    id="modal-modal-title"
                    variant="h3"
                  >
                    Are you sure you want to resolve this ticket?
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className="confirmation-btn" onClick={handleYes}>
                      Yes
                    </button>
                    <button className="confirmation-btn" onClick={handleClose}>
                      No
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ResolveModal;

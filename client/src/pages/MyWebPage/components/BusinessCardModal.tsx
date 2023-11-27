import { Box, Modal, Typography } from "@mui/material"
import "../../../admin/pages/Profile/components/ProfileHeader/BusinessCard/BusinessCard.scss"
import WebPageBusinessCard from "./WebPageBusinessCard"
import { exportComponentAsJPEG } from "react-component-export-image"
import BusinessCard from "admin/pages/Profile/components/ProfileHeader/BusinessCard/BusinessCard"

const BusinessCardModal = ({
  modalOpen,
  setModalOpen,
  emailAddress,
  firstName,
  lastName,
  position,
  licenseNumber,
  phoneNumber,
  state,
  userGuid,
  CardDownloadHandler,
}) => {
  return (
    <Modal
      sx={{ background: "rgba(0, 0, 0, 0.7)" }}
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "336px",
          bgcolor: "background.paper",
          border: "2px solid #00004d",
          boxShadow: 24,
          p: 4,
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WebPageBusinessCard
            name={firstName + " " + lastName}
            phoneNumber={phoneNumber ?? ""}
            state={state ?? ""}
            licenseNumber={licenseNumber ?? ""}
            userGuid={userGuid ?? ""}
            email={emailAddress ?? ""}
            position={position[0].value ?? ""}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={CardDownloadHandler}>Download</button>
        </div>
        <hr
          style={{
            borderTop: "1px solid lightgray",
            margin: "1rem auto",
          }}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Download Business Card
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 0.2, mb: 2 }}>
          Expand your professional network by downloading the business card from
          this profile. Click the 'Download' button to collect valuable contacts
          effortlessly.
        </Typography>
      </Box>
    </Modal>
  )
}

export default BusinessCardModal

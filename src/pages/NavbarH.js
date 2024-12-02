// import React from "react";
// import { AppBar, Toolbar, Link } from "@mui/material";
// import logo from "../assets/trashtrack-logo.png";
// //import TrashTrack from "./assets/trashtrack-logo.png";

// import { styled } from "@mui/material/styles";

// const StyledAppBar = styled(AppBar)(({ theme }) => ({
//   background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
// }));

// export default function DenseAppBar() {
//   return (
//     <StyledAppBar position="fixed" sx={{ display: "flex" }}>
//       <Toolbar variant="dense">
//         <Link href="/">
//           <img
//             src={logo}
//             className="logo react"
//             alt="React logo"
//             sx={{ height: "50px", width: "50px" }}
//           />
//           {/* <img
//             src={TrashTrack}
//             className="trash-track"
//             alt="React logo"
//             sx={{ height: "50px", width: "50px", m: 1 }}
//           /> */}
//         </Link>
//       </Toolbar>
//     </StyledAppBar>
//   );
// } luis


import React from "react";
import { AppBar, Toolbar, Link } from "@mui/material";
import logo from "../assets/trashtrack-logo.png";
//import TrashTrack from "./assets/trashtrack-logo.png";

import { styled } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
}));

export default function DenseAppBar() {
  return (
    <StyledAppBar position="fixed" sx={{ display: "flex" }}>
      <Toolbar variant="dense">
        <Link href="/">
          <img
            src={logo}
            className="https://firebasestorage.googleapis.com/v0/b/trashtrack-ac6eb.appspot.com/o/website_assets%2Ftrashtrack-logo.png?alt=media&token=a4b3fb03-d665-4bb5-b0d6-94d88ebd6e71"
            alt="logo"
            sx={{ height: "50px", width: "50px" }}
          />
          {/* <img
            src={TrashTrack}
            className="trash-track"
            alt="React logo"
            sx={{ height: "50px", width: "50px", m: 1 }}
          /> */}
        </Link>
      </Toolbar>
    </StyledAppBar>
  );
}


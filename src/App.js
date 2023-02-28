import { useEffect, useState } from "react";
import { urlClient, LENS_HUB_CONTRACT_ADRESS, queryRecommendedProfiles, queryExplorePublications} from './queries'
import LENSHUB from "./lenshub.json"
import { ethers } from "ethers";
import {Box, Button, Image} from "@/chakra-ui/react"

function App() {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);


  return (
    <div className="app">

    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { urlClient, LENS_HUB_CONTRACT_ADRESS, queryRecommendedProfiles, queryExplorePublications} from './queries'
import LENSHUB from "./lenshub.json"
import { ethers } from "ethers";
import {Box, Button, Image} from "@/chakra-ui/react"
import { PossibleTypeExtensionsRule } from "graphql";

function App() {
  const [accounts, setAccounts] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);

  async function signIn(){
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setAccounts(accounts[0]);
  }
  async function getRecommendedProfiles(){
    const response = await urlClient.query(queryRecommendedProfiles).toPromise();
    const profiles = response.data.RecommendedProfiles.slice(0.5);
    setProfiles(profiles);
  }

  async function getPosts(){
    const response = await urlClient.query(queryExplorePublications).toPromise();
    const posts = response.data.queryExplorePublications.items.filter((posts) => {
    if (PossibleTypeExtensionsRule.profile) return posts;
    return ""
    });
    setPosts(posts);
  }

  async function follow(id){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  return (
    <div className="app">

    </div>
  );
}

export default App;

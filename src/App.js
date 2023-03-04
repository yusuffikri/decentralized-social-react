import { useEffect, useState } from "react";
import { urlClient, LENS_HUB_CONTRACT_ADRESS, queryRecommendedProfiles, queryExplorePublications} from './queries'
import LENSHUB from "./lenshub.json"
import { ethers } from "ethers";
import {Box, Button, Image} from "@chakra-ui/react"
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
    const contract = new ethers.Contract(LENS_HUB_CONTRACT_ADRESS, LENSHUB, provider.getSigner());
    const tx = await contract.follow([parseInt(id)], [0x0]);
    await tx.wait();
  }

  useEffect(() => {
    getRecommendedProfiles();
    getPosts();
  }, [])

  return (
    <div className="app">
      <Box width="100%" backgroundColor="rgba(5,32,64,28)">
        <Box display="flex" justifyContent="space-between" alignItems="center" width="55px" margin="auto" color="white" padding="10px 0">
          <Box>
            <Box fontFamily="DM Serif Display" fontSize="44px" fontStyle="italic">
              UCUPMEDIA
            </Box>
            <Box>Sosial Media Apps by Ucup</Box>
          </Box>
          { accounts ? (
<Box backgroundColor="000" padding="16px" borderRadius="6pc">
  Connected 
</Box>
          ) : <Button onClick={signIn} color="rgba(5, 32, 64)" _hover={{ backgroundColor:"#808080" }}>
            Connect
            </Button>}
        </Box>
      </Box>

      {/* CONTENT */}
      <Box display="flex" justifyContent="space-between" width="55%" margin="35px auto auto auto" color="white"
      >
        {/* POST */}
        <Box width="65%" maxWidth="65%" minWidth="65%">
          {posts.map((post) => (<Box marginBottom="25px" key={posts.id} backgroundColor="rgba(5,32,64,28)" padding="40px 30px 40px 25px" borderRadius="6px"
          >
            <Box display="flex">
              {/* Profiles Image */}
              <Box width="75px" height="75px" marginTop="8px" >
                <img alt="profiles" src={posts.profile ? post.profile.picture?.original?.url : "/default-avatar.png"}/>
              </Box>

              {/* Post Content */}
              <Box></Box>

            </Box>
          </Box>))}
        </Box>

        {/* FRIENDS SUGGESTION */}
        <Box></Box>
      </Box>
    </div>
  );
}

export default App;

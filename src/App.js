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

  const parseImageUrl = (profile) => {
    if (profile) {
      const url = posts.profile.picture?.original?.url;
      if (url && url.startsWith("ipfs:")){
        const ipfsHash = url.split("//")[1];
        return `https//:gateway.pinata.cloud/ipfs/${ipfsHash}`;
      }
      return url;
    }
  }

  return (
    <div className="app">
      <Box width="100%" backgroundColor="rgba(5,32,64,28)" >
        <Box display="flex"justifyContent="space-between" alignItems="left" margin="0 64px" color="white" padding="10px 10px">
          <Box>
            <Box  fontFamily="Poppins" fontSize="44px" fontStyle="italic">
              UCUPMEDIA
            </Box>
            <Box fontFamily="Poppins">Sosial Media Apps by Ucup</Box>
          </Box >
          { accounts ? (
          <Box backgroundColor="000" padding="16px" borderRadius="6px">
            Connected 
          </Box>
          ) : <Button margin="24px 0"  padding="16px 48px" onClick={signIn} color="rgba(5, 32, 64)" _hover={{ backgroundColor:"#808080" }}>
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
                <img alt="profiles" src={parseImageUrl(post.profile)}  width="75px" height="75px" onError={({ currentTarget}) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "/default-avatar.png";
                }}/> 
              </Box>

              {/* Post Content */}
              <Box flexGrow={1} marginLeft="20px"></Box>
              <Box display="flex" justtifyContent="space-between">
                <Box fontFamily="Poppins" fontSize="24px">
                  {post.profile?.handle}
                </Box>
                <Box height="50px" _hover={{  cursor:"pointer" }}>
                  <Image alt="follow icon" src="/follow-icon.png" height="50px" width="50px" onClick={() => follow(post.id)}/>

                </Box>
              </Box>
              <Box overflowWrap="anywhere" fontSize="14px">
                {post.metadata?.content}
              </Box>
            </Box>
          </Box>))}
        </Box>

        {/* FRIENDS SUGGESTION */}
        <Box width="30%" backgroundColor="rgba(5,32,64,28)" padding="40px 25px" borderRadius="6px" height="fit-content">
          <Box fontFamily="Poppins">FRIEND SUGGESTION</Box>
          <Box>
            {profiles.map((profile, i ) => (
              <Box key={profile.id} margin="30px 0" display="flex" alignItems="center" height="40px" _hover={{ color: "#808080", cursor: "pointer" }} >
                <img alt="profiles" src={parseImageUrl(profiles)} width="40px" height="40px" onError={({ currentTarget}) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "/default-avatar.png";
                }}/>
                <Box marginLeft="25px">
                  <h4>{profile.name}</h4>
                  <p>{profile.handle}</p>

                </Box>
              </Box>
            ))}
          </Box>
          </Box> 
      </Box>
    </div>
  );
}

export default App;

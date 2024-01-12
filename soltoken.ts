import {
    Collection,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionDataArgs,
    Creator,
    MPL_TOKEN_METADATA_PROGRAM_ID,
    UpdateMetadataAccountV2InstructionAccounts,
    UpdateMetadataAccountV2InstructionData,
    Uses,
    createMetadataAccountV3,
    updateMetadataAccountV2,
    findMetadataPda,
  } from "@metaplex-foundation/mpl-token-metadata";
  
  import * as web3 from "@solana/web3.js";
  import {
    PublicKey,
    createSignerFromKeypair,
    none,
    signerIdentity,
    some,
  } from "@metaplex-foundation/umi";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import {
    fromWeb3JsKeypair,
    fromWeb3JsPublicKey,
  } from "@metaplex-foundation/umi-web3js-adapters";
  
  function loadWalletKey(keypairFile: string): web3.Keypair {
    const fs = require("fs");
    const keypairFileContent = fs.readFileSync(keypairFile).toString();
    const loaded = web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(keypairFileContent)));
    return loaded;
  }
  
  const SOLANA_API_URL = "https://api.devnet.solana.com";
  const INITIALIZE = true;
  
  async function main() {
    try {
      console.log("SOL Token Executed.");
  
      // Replace with the actual file path of your signer wallet
      const signerWalletFile = "SIGNER_WALLET_FILE_PATH_HERE"; //SIGNER wALLET ADDRESS FILE
      const myKeypair = loadWalletKey(signerWalletFile);
      const mintAddress = new web3.PublicKey("TOKEN_ADDRESS_HERE"); //TOKEN ADDRESS
  
      const umi = createUmi(SOLANA_API_URL);
      const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
      umi.use(signerIdentity(signer, true));
  
      const metadataDetails = {
        name: "Baby Token",
        symbol: "BT",
        uri: "METADATA_LOCATION_HERE", //METADATA LOCATION VIA GITHUB
      };
  
      const onChainData = {
        ...metadataDetails,
        sellerFeeBasisPoints: 0,
        creators: none<Creator[]>(),
        collection: none<Collection>(),
        uses: none<Uses>(),
      };
  
      if (INITIALIZE) {
        const createMetadataAccounts: CreateMetadataAccountV3InstructionAccounts = {
          mint: fromWeb3JsPublicKey(mintAddress),
          mintAuthority: signer,
        };
  
        const createMetadataData: CreateMetadataAccountV3InstructionDataArgs = {
          isMutable: true,
          collectionDetails: null,
          data: onChainData,
        };
  
        const createTxid = await createMetadataAccountV3(umi, {
          ...createMetadataAccounts,
          ...createMetadataData,
        }).sendAndConfirm(umi);
  
        console.log("Metadata Account Created:", createTxid);
      } else {
        const updateMetadataData: UpdateMetadataAccountV2InstructionData = {
          data: some(onChainData),
          discriminator: 0,
          isMutable: some(true),
          newUpdateAuthority: none<PublicKey>(),
          primarySaleHappened: none<boolean>(),
        };
  
        const updateMetadataAccounts: UpdateMetadataAccountV2InstructionAccounts = {
          metadata: findMetadataPda(umi, { mint: fromWeb3JsPublicKey(mintAddress) }),
          updateAuthority: signer,
        };
  
        const updateTxid = await updateMetadataAccountV2(umi, {
          ...updateMetadataAccounts,
          ...updateMetadataData,
        }).sendAndConfirm(umi);
  
        console.log("Metadata Account Updated:", updateTxid);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  main();
  
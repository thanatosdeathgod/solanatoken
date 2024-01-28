// Importing necessary modules and functions from libraries
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

// Function to load a Solana wallet key from a file
function loadWalletKey(keypairFile: string): web3.Keypair {
  const fs = require("fs");
  const keypairFileContent = fs.readFileSync(keypairFile).toString();
  const loaded = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(keypairFileContent))
  );
  return loaded;
}

// Solana API URL and initialization flag
const SOLANA_API_URL = "https://api.devnet.solana.com";
const INITIALIZE = true;

// Main function
async function main() {
  try {
    console.log("SOL Token Executed.");

    // Replace with the actual file path of your signer wallet
    const signerWalletFile = "id.json"; // SIGNER WALLET ADDRESS FILE
    const myKeypair = loadWalletKey(signerWalletFile);
    const mintAddress = new web3.PublicKey(
      "6PJeiwtTDUnB9LZJB6wMXgCWReFzs53m3GMAf8jJ7dcd"
    ); // TOKEN ADDRESS

    // Creating UMI instance and setting up the signer
    const umi = createUmi(SOLANA_API_URL);
    const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(myKeypair));
    umi.use(signerIdentity(signer, true));

    // Metadata details for the on-chain data
    const metadataDetails = {
      name: "John Pork Token",
      symbol: "JP",
      uri: "https://raw.githubusercontent.com/azzraaeel/solanatoken/main/metadata.json", // METADATA LOCATION VIA GITHUB
    };

    // Merging metadata details with additional on-chain data
    const onChainData = {
      ...metadataDetails,
      sellerFeeBasisPoints: 0,
      creators: none<Creator[]>(),
      collection: none<Collection>(),
      uses: none<Uses>(),
      links: {
        website: "https://johnpork.com",
        twitter: "https://twitter.com/johnpork",
        telegram: "https://t.me/johnpork",
      },
    };

    if (INITIALIZE) {
      const createMetadataAccounts: CreateMetadataAccountV3InstructionAccounts =
        {
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
      // Updating existing metadata account
      const updateMetadataData: UpdateMetadataAccountV2InstructionData = {
        data: some(onChainData),
        discriminator: 0,
        isMutable: some(true),
        newUpdateAuthority: none<PublicKey>(),
        primarySaleHappened: none<boolean>(),
      };

      const updateMetadataAccounts: UpdateMetadataAccountV2InstructionAccounts =
        {
          metadata: findMetadataPda(umi, {
            mint: fromWeb3JsPublicKey(mintAddress),
          }),
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

// Calling the main function to execute the script
main();

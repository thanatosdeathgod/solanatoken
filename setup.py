import subprocess
import os

def download_and_execute(url, output_path, version=None):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    print(f"Downloading {url}...")
    subprocess.run(["curl", url, "--output", output_path, "--create-dirs"], shell=True, check=True)

    if version:
        print(f"{output_path} {version}")
        subprocess.run([output_path, version], shell=True, check=True)

# Download Solana CLI
solana_install_url = "https://release.solana.com/v1.17.15/solana-install-init-x86_64-pc-windows-msvc.exe"
solana_install_path = r"C:\solana-install-tmp\solana-install-init.exe"

download_and_execute(solana_install_url, solana_install_path, version="v1.17.15")

# Download Dependencies
print("Installing yarn globally...")
subprocess.run(["npm", "install", "-g", "yarn"], shell=True, check=True)

print("Installing ts-node globally...")
subprocess.run(["npm", "install", "-g", "ts-node"], shell=True, check=True)

print("Setting Execution Policy to RemoteSigned...")
subprocess.run(["Set-ExecutionPolicy", "RemoteSigned"], shell=True, check=True)

print("Adding @metaplex-foundation/mpl-token-metadata to yarn...")
subprocess.run(["yarn", "add", "@metaplex-foundation/mpl-token-metadata"], shell=True, check=True)

print("Adding @metaplex-foundation/umi to yarn...")
subprocess.run(["yarn", "add", "@metaplex-foundation/umi"], shell=True, check=True)

print("Installing web3.js and other dependencies...")
subprocess.run(["npm", "install", "--save", "@solana/web3.js", "@metaplex-foundation/umi-bundle-defaults", "@metaplex-foundation/umi-web3js-adapters", "--force"], shell=True, check=True)

print("Setting Execution Policy to Restricted...")
subprocess.run(["Set-ExecutionPolicy", "Restricted"], shell=True, check=True)

print("Installation complete.")

package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func downloadAndExecute(url, outputPath, version string) error {
	// Create the directory if it doesn't exist
	err := os.MkdirAll(filepath.Dir(outputPath), os.ModePerm)
	if err != nil {
		return err
	}

	fmt.Printf("Downloading %s...\n", url)
	// Download the file using curl
	cmd := exec.Command("curl", url, "--output", outputPath, "--create-dirs")
	err = cmd.Run()
	if err != nil {
		return err
	}

	if version != "" {
		fmt.Printf("%s %s\n", outputPath, version)
		// Execute the downloaded file with the version
		cmd = exec.Command(outputPath, version)
		err = cmd.Run()
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	// Download Solana CLI
	solanaInstallURL := "https://release.solana.com/v1.17.15/solana-install-init-x86_64-pc-windows-msvc.exe"
	solanaInstallPath := `C:\solana-install-tmp\solana-install-init.exe`

	err := downloadAndExecute(solanaInstallURL, solanaInstallPath, "v1.17.15")
	if err != nil {
		fmt.Printf("Error downloading and executing Solana CLI: %v\n", err)
		return
	}

	// Download Dependencies
	fmt.Println("Installing yarn globally...")
	cmd := exec.Command("npm", "install", "-g", "yarn")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error installing yarn: %v\n", err)
		return
	}

	fmt.Println("Installing ts-node globally...")
	cmd = exec.Command("npm", "install", "-g", "ts-node")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error installing ts-node: %v\n", err)
		return
	}

	fmt.Println("Setting Execution Policy to RemoteSigned...")
	cmd = exec.Command("powershell", "-Command", "Set-ExecutionPolicy RemoteSigned")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error setting Execution Policy: %v\n", err)
		return
	}

	fmt.Println("Adding @metaplex-foundation/mpl-token-metadata to yarn...")
	cmd = exec.Command("yarn", "add", "@metaplex-foundation/mpl-token-metadata")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error adding @metaplex-foundation/mpl-token-metadata: %v\n", err)
		return
	}

	fmt.Println("Adding @metaplex-foundation/umi to yarn...")
	cmd = exec.Command("yarn", "add", "@metaplex-foundation/umi")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error adding @metaplex-foundation/umi: %v\n", err)
		return
	}

	fmt.Println("Installing web3.js and other dependencies...")
	cmd = exec.Command("npm", "install", "--save", "@solana/web3.js", "@metaplex-foundation/umi-bundle-defaults", "@metaplex-foundation/umi-web3js-adapters", "--force")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error installing dependencies: %v\n", err)
		return
	}

	fmt.Println("Setting Execution Policy to Restricted...")
	cmd = exec.Command("powershell", "-Command", "Set-ExecutionPolicy Restricted")
	err = cmd.Run()
	if err != nil {
		fmt.Printf("Error setting Execution Policy: %v\n", err)
		return
	}

	fmt.Println("Installation complete.")
}

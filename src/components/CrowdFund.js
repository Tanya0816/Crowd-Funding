import React, { useState } from "react";
import { ethers } from "ethers";
import "./vintage.css";

function CrowdFund() {
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [signer2, setSigner2] = useState(null);
    const [contract, setContract] = useState(null);
    const [contract2, setContract2] = useState(null);
    const [donation, setDonation] = useState("");
    const [account1Address, setAccount1Address] = useState("");
    const [account2Address, setAccount2Address] = useState("");

    const ContractAddress = "0xCeaD39481F70BFAb8fFA83216E01858B12D684b0";

    const abi = [
        {
            "inputs": [
                { "internalType": "uint256", "name": "_endTime", "type": "uint256" },
                { "internalType": "uint256", "name": "_goalAmount", "type": "uint256" }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "checkAllFunds",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{ "internalType": "address", "name": "myAddress", "type": "address" }],
            "name": "checkYourFunds",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        { "inputs": [], "name": "endFunding", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
        {
            "inputs": [],
            "name": "endTime",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "goalAmount",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isStarted",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "view",
            "type": "function"
        },
        { "inputs": [], "name": "setFund", "outputs": [], "stateMutability": "payable", "type": "function" },
        {
            "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
            "name": "withdrawalSomeFunds",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawlAll",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    async function main() {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

            if (accounts.length < 2) {
                alert("Please ensure you have at least 2 accounts in your wallet!");
                return;
            }

            const provider1 = new ethers.BrowserProvider(window.ethereum);
            setProvider(provider1);

            // Account 1: Campaign Creator (can start funding and withdraw)
            const signer1 = await provider1.getSigner(accounts[0]);
            setSigner(signer1);
            setAccount1Address(accounts[0]);

            // Account 2: Donor (can donate to the campaign)
            const signerTwo = await provider1.getSigner(accounts[1]);
            setSigner2(signerTwo);
            setAccount2Address(accounts[1]);

            // Contract instance for Account 1 (Creator)
            const c1 = new ethers.Contract(ContractAddress, abi, signer1);
            setContract(c1);

            // Contract instance for Account 2 (Donor)
            const c2 = new ethers.Contract(ContractAddress, abi, signerTwo);
            setContract2(c2);

            console.log("Account 1 (Creator):", accounts[0]);
            console.log("Account 2 (Donor):", accounts[1]);
        } catch (error) {
            console.log("Wallet connection error:", error);
        }
    }

    async function handleBalanceCheck() {
        try {
            const balanceAll = await contract.checkAllFunds();
            setBalance(balanceAll.toString());
        } catch (err) {
            console.log(err);
        }
    }

    // Account 2 (Donor) donates to the campaign
    async function handleSetFunds() {
        try {
            if (!contract2) {
                alert("Please connect wallet first!");
                return;
            }
            const txn = await contract2.setFund({
                value: ethers.parseUnits(donation, "ether")
            });
            await txn.wait();
            alert("Donation successful from Account 2!");
            setDonation("");
        } catch (err) {
            console.log("Donation error:", err);
            alert("Donation failed: " + err.message);
        }
    }

    // Account 1 (Creator) withdraws all funds
    async function withdrawAll() {
        try {
            if (!contract) {
                alert("Please connect wallet first!");
                return;
            }
            const txn = await contract.withdrawlAll();
            await txn.wait();
            alert("Withdrawal successful by Account 1!");
        } catch (err) {
            console.log("Withdraw error:", err);
            alert("Withdrawal failed: " + err.message);
        }
    }

    return (
        <div className="vintage-container">

            <header className="vintage-header">
                <h1 className="title">Decentralized Classic Crowdfund</h1>
                <p className="sub-title">Support a Cause — On Chain.</p>

                <button onClick={main} type="button" className="btn-vintage">
                    Connect Wallet
                </button>

                {account1Address && (
                    <div style={{ marginTop: "20px", fontSize: "14px" }}>
                        <p><strong>Account 1 (Creator):</strong> {account1Address.slice(0, 6)}...{account1Address.slice(-4)}</p>
                        <p><strong>Account 2 (Donor):</strong> {account2Address.slice(0, 6)}...{account2Address.slice(-4)}</p>
                    </div>
                )}
            </header>

            <div className="vintage-card">

                <img src="./funding.jpg" className="vintage-img" alt="funding" />

                <label className="input-label">Donation Amount (ETH)</label>
                <input
                    value={donation}
                    onChange={(e) => setDonation(e.target.value)}
                    className="vintage-input"
                    type="text"
                />

                <button onClick={handleSetFunds} type="button" className="btn-donate">
                    Donate (Account 2)
                </button>

                <button onClick={withdrawAll} type="button" className="btn-withdraw">
                    Withdraw All (Account 1)
                </button>

                <button onClick={handleBalanceCheck} type="button" className="btn-check">
                    Check Total Funds
                </button>

                {balance !== "" && (
                    <p className="balance-text">Total Raised: {balance} wei</p>
                )}
            </div>
        </div>
    );
}

export default CrowdFund;

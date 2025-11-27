import React, { useEffect } from "react";
import { BrowserProvider } from "ethers";

function CrowdFund() {

    useEffect(() => {
        async function connect() {
            const ContractAddress = "0x1c048813fE2a27f9C658b980d900493d0C557771";

            if (!window.ethereum) {
                console.log("MetaMask not found");
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            console.log("Provider:", provider);

            const signer = await provider.getSigner();
            console.log("Signer:", signer);
        }

        connect();
    }, []);

    return (
        <div>
            <h1>Hello</h1>
        </div>
    );
}

export default CrowdFund;

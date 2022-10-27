import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

// interface Web3Api {
//   provider?: any;
//   web3?: Web3 | null;
// }

function App() {
  const [web3Api, setWeb3Api] = useState<{
    provider: any;
    web3: any;
    contract?: any;
  }>({
    provider: null,
    web3: null,
    contract: null,
  });

  const [fundLoading, setLoading] = useState(false);
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const canConnectToContract = account && web3Api.contract;

  const setAccountListner = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());

    provider.on("chainChanged", (_) => window.location.reload());

    // provider._jsonRpcConnection.events.on("notification", (payload) => {
    //   const { method } = payload;

    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // });
  };

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };

    web3Api.contract && loadBalance();
  }, [web3Api, fundLoading]);

  useEffect(() => {
    const loadProvider = async () => {
      setIsProviderLoading(true);
      let provider = await detectEthereumProvider();
      // console.log(contract);

      if (provider) {
        setAccountListner(provider);
        const contract = await loadContract("Faucet", provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      }

      setIsProviderLoading(false);
    };

    loadProvider();

    return () => {};
  }, []);

  console.log(web3Api.web3);

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api?.web3?.eth?.getAccounts();
      setAccount(accounts[0]);
      console.log("my account", accounts);
    };

    web3Api.web3 && getAccounts();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    setLoading(true);
    const { contract, web3 } = web3Api;
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });

    setLoading(false);
  }, [web3Api.contract, web3Api.web3, account]);

  const withdraw = useCallback(async () => {
    setLoading(false);
    const { contract, web3 } = web3Api;
    const withdrawamount = web3.utils.toWei("1", "ether");
    await contract.withdraw(withdrawamount, {
      from: account,
    });

    setLoading(false);
  }, [web3Api, account]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {isProviderLoading ? (
            <div>Looking for Web3...</div>
          ) : (
            <div className="is-flex is-align-items-center">
              <span>
                <strong>Account: </strong>
              </span>
              {account ? (
                <span className="ml-2">{account}</span>
              ) : !web3Api.provider ? (
                <>
                  <div className="notification is-warning is-size-7 is-small is-rounded ml-2">
                    Wallet is not detected!{" "}
                    <a rel="noreferrer" target="_blank">
                      Install Metamask
                    </a>
                  </div>
                </>
              ) : (
                <button
                  onClick={() =>
                    web3Api.provider.request({ method: "eth_requestAccounts" })
                  }
                  className="button is-small ml-2"
                >
                  Connect
                </button>
              )}
            </div>
          )}
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          {!canConnectToContract && (
            <div className="is-block">Connect to Ganache Local Network</div>
          )}

          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-primary mr-2"
          >
            Donate 1 Ether
          </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-link"
          >
            Withdraw 1 eth
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

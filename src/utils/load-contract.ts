import contract from "@truffle/contract";

export const loadContract = async (name, provider) => {
  const res = await fetch(`./src/assets/contracts/${name}.json`);
  const Artifact = await res.json();
  console.log("contract abi", Artifact);

  const _contract = contract(Artifact);
  _contract.setProvider(provider);

  let deployedContract = null;

  try {
    deployedContract = await _contract.deployed();
  } catch {
    console.error("You are connected to wrong ethereum network");
  }

  return deployedContract;
};
